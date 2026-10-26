-- ============================================================================
-- A05. ESTADÍSTICAS DE JUEGO POR ALUMNO (Ranking de jugadores).
--
-- Una sola consulta agrega game_sessions y game_attempts por alumno: partidas,
-- juegos distintos, preguntas, aciertos, juegos dominados, tiempo aproximado y
-- última vez que jugó. Nada se guarda (regla 2): se calcula al leer.
--
-- SECURITY INVOKER: corre con los permisos de quien consulta, así que la RLS de
-- 81 decide qué alumnos aparecen (admin y administrativo, todo el colegio; el
-- docente, los alumnos de las secciones que dicta; el apoderado, sus hijos; el
-- alumno, solo él).
--
-- Tiempo aproximado: dentro de cada partida se suman los intervalos entre una
-- respuesta y la siguiente, con un tope de 120 s por intervalo (si tardó más,
-- se distrajo o dejó la pestaña abierta), más 20 s por la primera pregunta de
-- cada partida. Es la misma regla que estimatedSeconds() en lib/games/stats.ts.
-- ============================================================================

create or replace function game_player_stats(p_since timestamptz default null)
returns table (
  student_id      uuid,
  sessions        bigint,
  skills          bigint,
  answered        bigint,
  correct         bigint,
  mastered        bigint,
  seconds         bigint,
  last_played_at  timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
  with a as (
    select
      ga.student_id,
      ga.session_id,
      ga.skill_id,
      ga.is_correct,
      ga.answered_at,
      extract(epoch from ga.answered_at - lag(ga.answered_at) over (partition by ga.session_id order by ga.answered_at)) as gap
    from game_attempts ga
    where p_since is null or ga.answered_at >= p_since
  )
  select
    a.student_id,
    count(distinct a.session_id) as sessions,
    count(distinct a.skill_id) as skills,
    count(*) as answered,
    count(*) filter (where a.is_correct) as correct,
    (
      select count(distinct gs.skill_id)
      from game_sessions gs
      where gs.student_id = a.student_id and gs.mastered_at is not null
        and (p_since is null or gs.mastered_at >= p_since)
    ) as mastered,
    sum(case when a.gap is null then 20 else least(a.gap, 120) end)::bigint as seconds,
    max(a.answered_at) as last_played_at
  from a
  group by a.student_id
$$;

grant execute on function game_player_stats(timestamptz) to authenticated;
