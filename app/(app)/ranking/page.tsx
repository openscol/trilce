import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { classGroupLabel } from "@/lib/class-group";
import { formatDuration, periodSince } from "@/lib/games/stats";
import { RankingFilters } from "./ranking-filters";

// Ranking de jugadores: todos los alumnos que el usuario puede ver (la RLS de
// game_sessions/game_attempts decide: admin y administrativo, el colegio; el
// docente, sus secciones; el apoderado, sus hijos) con sus estadísticas.

const PERIODS = { "7": "Últimos 7 días", "30": "Últimos 30 días", todo: "Desde siempre" } as const;
const ORDERS = { aciertos: "Más aciertos", tiempo: "Más tiempo", juegos: "Más juegos", precision: "Mejor precisión", recientes: "Jugó hace poco" } as const;
type Period = keyof typeof PERIODS;
type Order = keyof typeof ORDERS;

const pct = (n: number) => `${Math.round(n * 100)}%`;
const dateFmt = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short" });

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RankingPage(props: PageProps<"/ranking">) {
  const ctx = await requireAppContext();
  // El alumno solo se ve a sí mismo: va directo a su historial.
  if (ctx.role === "alumno" && ctx.targetId) redirect(`/ranking/${ctx.targetId}`);

  const sp = await props.searchParams;
  const period: Period = (first(sp.periodo) ?? "30") in PERIODS ? ((first(sp.periodo) ?? "30") as Period) : "30";
  const order: Order = (first(sp.orden) ?? "aciertos") in ORDERS ? ((first(sp.orden) ?? "aciertos") as Order) : "aciertos";
  const section = first(sp.seccion) ?? "todas";

  const since = periodSince(period);
  const supabase = await createClient();
  const { data: stats } = await supabase.rpc("game_player_stats", { p_since: since });

  const ids = (stats ?? []).map((s) => s.student_id);
  const { data: students } = ids.length
    ? await supabase
        .from("students")
        .select("id, code, first_names, paternal_surname, maternal_surname, class_group_id, class_groups(academic_year, level, grade, section)")
        .in("id", ids)
    : { data: [] };
  const byId = new Map((students ?? []).map((s) => [s.id, s]));

  const sections = new Map<string, string>();
  for (const s of students ?? []) if (s.class_groups && s.class_group_id) sections.set(s.class_group_id, classGroupLabel(s.class_groups));

  const rows = (stats ?? [])
    .map((st) => {
      const s = byId.get(st.student_id);
      return {
        ...st,
        name: s ? `${s.paternal_surname}${s.maternal_surname ? ` ${s.maternal_surname}` : ""}, ${s.first_names}` : "Alumno",
        code: s?.code ?? "",
        sectionId: s?.class_group_id ?? null,
        sectionLabel: s?.class_groups ? classGroupLabel(s.class_groups) : "Sin sección",
        accuracy: st.answered ? st.correct / st.answered : 0,
      };
    })
    .filter((r) => section === "todas" || r.sectionId === section);

  const sorters: Record<Order, (a: (typeof rows)[number], b: (typeof rows)[number]) => number> = {
    aciertos: (a, b) => b.correct - a.correct || b.accuracy - a.accuracy,
    tiempo: (a, b) => b.seconds - a.seconds,
    juegos: (a, b) => b.skills - a.skills || b.sessions - a.sessions,
    // Con pocas respuestas la precisión engaña: primero quienes contestaron al menos 10.
    precision: (a, b) => Number(b.answered >= 10) - Number(a.answered >= 10) || b.accuracy - a.accuracy || b.answered - a.answered,
    recientes: (a, b) => b.last_played_at.localeCompare(a.last_played_at),
  };
  rows.sort(sorters[order]);

  const totals = rows.reduce(
    (t, r) => ({ sessions: t.sessions + r.sessions, answered: t.answered + r.answered, correct: t.correct + r.correct, seconds: t.seconds + r.seconds }),
    { sessions: 0, answered: 0, correct: 0, seconds: 0 }
  );
  const isFamily = ctx.role === "padre";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Ranking de jugadores</h1>
          <p className="text-sm text-muted-foreground">
            {isFamily ? "Cómo juegan tus hijos: elige uno para ver su historial completo." : "Alumnos que están jugando. Elige uno para ver su historial completo."}
          </p>
        </div>
        <RankingFilters period={period} order={order} section={section} sections={[...sections].map(([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }))} showSections={!isFamily} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["Jugadores", String(rows.length)],
          ["Partidas", String(totals.sessions)],
          ["Preguntas", String(totals.answered)],
          ["Aciertos", totals.answered ? pct(totals.correct / totals.answered) : "—"],
          ["Tiempo de juego", formatDuration(totals.seconds)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-medium tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="w-10 px-3 py-2 font-normal">#</th>
              <th className="px-3 py-2 font-normal">Alumno</th>
              <th className="px-3 py-2 text-right font-normal">Juegos</th>
              <th className="px-3 py-2 text-right font-normal">Partidas</th>
              <th className="px-3 py-2 text-right font-normal">Preguntas</th>
              <th className="min-w-40 px-3 py-2 font-normal">Aciertos · fallos</th>
              <th className="px-3 py-2 text-right font-normal">Dominados</th>
              <th className="px-3 py-2 text-right font-normal">Tiempo</th>
              <th className="px-3 py-2 text-right font-normal">Última vez</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                  Nadie jugó en este periodo.
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.student_id} className="border-b border-border last:border-0 hover:bg-accent">
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{i + 1}</td>
                <td className="px-3 py-2">
                  <Link href={`/ranking/${r.student_id}?periodo=${period}`} className="flex flex-col hover:underline">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.sectionLabel}</span>
                  </Link>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{r.skills}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.sessions}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.answered}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-24 shrink-0 gap-0.5 overflow-hidden rounded-full" aria-hidden>
                      <div className="h-full rounded-l-full bg-brand-green" style={{ width: pct(r.accuracy) }} />
                      <div className="h-full flex-1 rounded-r-full bg-destructive/60" />
                    </div>
                    <span className="whitespace-nowrap text-xs tabular-nums">
                      <span className="font-medium">{pct(r.accuracy)}</span> · ✓ {r.correct} · ✗ {r.answered - r.correct}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{r.mastered}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">{formatDuration(r.seconds)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap text-muted-foreground">{dateFmt.format(new Date(r.last_played_at))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        El tiempo es aproximado: suma lo que tardó entre una respuesta y la siguiente (máximo 2 minutos por pregunta). «Dominados»: juegos en los que llegó a 100 puntos.
      </p>
    </div>
  );
}
