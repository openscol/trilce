import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, SparklesIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { classGroupLabel } from "@/lib/class-group";
import { getSkill, skillHref } from "@/lib/games/catalog";
import { resolveSkillUid } from "@/lib/games/legacy-ids";
import { aggregate, estimatedSeconds, formatDuration, MIN_ATTEMPTS, periodSince, skillTitle, WEAK_ACCURACY } from "@/lib/games/stats";
import { cn } from "@/lib/utils";
import { RankingFilters } from "../ranking-filters";

// Historial completo de juego de un alumno. La RLS decide si el usuario puede
// verlo (el propio alumno, sus apoderados, sus docentes, la administración).

const pct = (n: number) => `${Math.round(n * 100)}%`;
const dateTime = new Intl.DateTimeFormat("es-PE", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const dateOnly = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" });

type StoredQuestion = { prompt?: string; visual?: { kind?: string; text?: string } } | null;

function AccuracyBar({ correct, total }: { correct: number; total: number }) {
  const acc = total ? correct / total : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-2 w-24 shrink-0 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        <div className="h-full rounded-l-full bg-brand-green" style={{ width: pct(acc) }} />
        <div className="h-full flex-1 rounded-r-full bg-destructive/60" />
      </div>
      <span className="whitespace-nowrap text-xs tabular-nums">
        <span className="font-medium">{pct(acc)}</span> · ✓ {correct} · ✗ {total - correct}
      </span>
    </div>
  );
}

export default async function StudentGamesPage(props: PageProps<"/ranking/[studentId]">) {
  const { studentId } = await props.params;
  const sp = await props.searchParams;
  const periodParam = Array.isArray(sp.periodo) ? sp.periodo[0] : sp.periodo;
  const period = periodParam === "7" || periodParam === "30" ? periodParam : "todo";
  const since = periodSince(period);

  const ctx = await requireAppContext();
  const supabase = await createClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, code, first_names, paternal_surname, maternal_surname, class_groups(academic_year, level, grade, section)")
    .eq("id", studentId)
    .maybeSingle();
  if (!student) notFound();

  let sessionsQuery = supabase.from("game_sessions").select("id, skill_id, score, mastered_at, started_at").eq("student_id", studentId).order("started_at", { ascending: false }).limit(1000);
  let attemptsQuery = supabase
    .from("game_attempts")
    .select("id, session_id, skill_id, tag, question, given_answer, correct_answer, is_correct, answered_at")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: true })
    .limit(10000);
  if (since) {
    sessionsQuery = sessionsQuery.gte("updated_at", since);
    attemptsQuery = attemptsQuery.gte("answered_at", since);
  }
  const [{ data: sessions }, { data: attempts }] = await Promise.all([sessionsQuery, attemptsQuery]);
  const all = attempts ?? [];

  const bySession = new Map<string, typeof all>();
  for (const a of all) bySession.set(a.session_id, [...(bySession.get(a.session_id) ?? []), a]);
  const played = (sessions ?? []).filter((s) => bySession.has(s.id));

  const stats = aggregate(all);
  const perSkill = [...stats.values()]
    .map((st) => {
      const rows = all.filter((a) => resolveSkillUid(a.skill_id) === st.skillId);
      return {
        ...st,
        skill: getSkill(st.skillId),
        sessions: new Set(rows.map((r) => r.session_id)).size,
        seconds: estimatedSeconds(rows),
        mastered: (sessions ?? []).some((s) => resolveSkillUid(s.skill_id) === st.skillId && s.mastered_at),
      };
    })
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  const weak = perSkill.filter((r) => r.total >= MIN_ATTEMPTS && r.accuracy < WEAK_ACCURACY).sort((a, b) => a.accuracy - b.accuracy);

  const total = all.length;
  const correct = all.filter((a) => a.is_correct).length;
  const name = `${student.first_names} ${student.paternal_surname}${student.maternal_surname ? ` ${student.maternal_surname}` : ""}`;
  const isSelf = ctx.role === "alumno";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          {!isSelf && (
            <Link href={`/ranking?periodo=${period}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeftIcon className="size-3.5" />
              Ranking de jugadores
            </Link>
          )}
          <h1 className="text-lg font-medium">{isSelf ? "Mis juegos" : name}</h1>
          <p className="text-sm text-muted-foreground">
            {student.code}
            {student.class_groups ? ` · ${classGroupLabel(student.class_groups)}` : ""}
          </p>
        </div>
        <RankingFilters period={period} />
      </div>

      {total === 0 ? (
        <p className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">No hay partidas en este periodo.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {[
              ["Juegos jugados", String(perSkill.length)],
              ["Partidas", String(played.length)],
              ["Preguntas", String(total)],
              ["Aciertos", `${correct} (${pct(correct / total)})`],
              ["Fallos", String(total - correct)],
              ["Tiempo de juego", formatDuration(estimatedSeconds(all))],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-medium tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase text-muted-foreground">A repasar</h2>
            {weak.length === 0 ? (
              <p className="rounded-2xl border border-border p-4 text-sm text-muted-foreground">
                Ningún juego con menos de {pct(WEAK_ACCURACY)} de aciertos (con al menos {MIN_ATTEMPTS} respuestas).
              </p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {weak.map((r) => (
                  <Link key={r.skillId} href={skillHref(r.skillId)} className="flex flex-col gap-1 rounded-2xl border border-border p-4 hover:bg-accent">
                    <span className="text-sm font-medium">
                      {skillTitle(r.skillId)} <span className="font-normal text-muted-foreground">· {r.skill?.gradeLabel}</span>
                    </span>
                    <AccuracyBar correct={r.correct} total={r.total} />
                    {r.weakTags.length > 0 && <span className="text-xs text-muted-foreground">Falla más en: {r.weakTags.slice(0, 3).map((t) => t.tag).join(", ")}</span>}
                  </Link>
                ))}
              </div>
            )}
            <p className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
              <SparklesIcon className="size-3.5 shrink-0" />
              Próximamente: ejercicios sugeridos por inteligencia artificial según su nivel, a partir de este historial.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase text-muted-foreground">Por juego</h2>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="px-3 py-2 font-normal">Juego</th>
                    <th className="px-3 py-2 text-right font-normal">Partidas</th>
                    <th className="px-3 py-2 text-right font-normal">Preguntas</th>
                    <th className="min-w-40 px-3 py-2 font-normal">Aciertos · fallos</th>
                    <th className="px-3 py-2 text-right font-normal">Tiempo</th>
                    <th className="px-3 py-2 text-right font-normal">Última vez</th>
                  </tr>
                </thead>
                <tbody>
                  {perSkill.map((r) => (
                    <tr key={r.skillId} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <span className="flex flex-col">
                          <span className="flex items-center gap-2">
                            {r.skill?.title ?? "Juego que ya no existe"}
                            {r.mastered && <Badge variant="outline">Dominado</Badge>}
                          </span>
                          <span className="text-xs text-muted-foreground">{r.skill ? `${r.skill.category === "matematicas" ? "Matemáticas" : r.skill.category === "comunicacion" ? "Comunicación" : "Computación"} · ${r.skill.gradeLabel}` : r.skillId}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.sessions}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.total}</td>
                      <td className="px-3 py-2">
                        <AccuracyBar correct={r.correct} total={r.total} />
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">{formatDuration(r.seconds)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap text-muted-foreground">{dateOnly.format(new Date(r.lastAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase text-muted-foreground">Historial de partidas</h2>
            <p className="text-xs text-muted-foreground">Abre una partida para ver cada pregunta, lo que respondió y la respuesta correcta.</p>
            <div className="flex flex-col gap-2">
              {played.map((s) => {
                const list = bySession.get(s.id) ?? [];
                const ok = list.filter((a) => a.is_correct).length;
                return (
                  <details key={s.id} className="group rounded-2xl border border-border">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                      <span className="w-36 shrink-0 text-xs text-muted-foreground">{dateTime.format(new Date(list[0]?.answered_at ?? s.started_at))}</span>
                      <span className="min-w-0 flex-1">
                        {skillTitle(s.skill_id)} <span className="text-xs text-muted-foreground">· {getSkill(s.skill_id)?.gradeLabel}</span>
                      </span>
                      <AccuracyBar correct={ok} total={list.length} />
                      <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">{formatDuration(estimatedSeconds(list))}</span>
                    </summary>
                    <ol className="flex flex-col border-t border-border">
                      {list.map((a, i) => {
                        const q = a.question as StoredQuestion;
                        return (
                          <li key={a.id} className="flex gap-3 border-b border-border px-4 py-2 text-sm last:border-0">
                            <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", a.is_correct ? "bg-brand-green/15 text-brand-green-text" : "bg-destructive/10 text-destructive")}>
                              {a.is_correct ? <CheckIcon className="size-3" /> : <XIcon className="size-3" />}
                              <span className="sr-only">{a.is_correct ? "Correcta" : "Incorrecta"}</span>
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <span>
                                <span className="text-muted-foreground tabular-nums">{i + 1}. </span>
                                {q?.prompt}
                                {q?.visual?.kind === "text" && <span className="ml-1 whitespace-pre-wrap font-medium">{q.visual.text}</span>}
                              </span>
                              <span className="text-xs">
                                Respondió <span className={a.is_correct ? "text-brand-green-text" : "text-destructive"}>{a.given_answer}</span>
                                {!a.is_correct && (
                                  <>
                                    {" "}
                                    · correcta <span className="text-brand-green-text">{a.correct_answer}</span>
                                  </>
                                )}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </details>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
