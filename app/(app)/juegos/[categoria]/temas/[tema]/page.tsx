import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { skillHref, skillUid, topicBlocks } from "@/lib/games/catalog";
import { getTopic } from "@/lib/games/topics";
import { getGameMode } from "@/lib/games/mode-server";
import { modeLabel } from "@/lib/games/modes";
import { getCurriculum, isExtended } from "@/lib/games/catalog";
import { aggregate, MIN_ATTEMPTS, WEAK_ACCURACY, type SkillStat } from "@/lib/games/stats";
import { cn } from "@/lib/utils";

function ExtendedBadge() {
  return <span className="w-fit rounded-md bg-sky-500/10 px-1.5 py-0.5 text-xs text-sky-600 dark:text-sky-400">{modeLabel("extendido")}</span>;
}

// Un tema (p. ej. «Suma y resta») con sus juegos de todos los grados.
export default async function TemaPage(props: PageProps<"/juegos/[categoria]/temas/[tema]">) {
  const { categoria, tema } = await props.params;
  const ctx = await requireAppContext();
  const found = getTopic(categoria, tema);
  if (!found) notFound();
  const mode = await getGameMode();
  const blocks = topicBlocks(categoria, tema, mode);

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("game_categories")
    .select("name, icon")
    .eq("school_id", ctx.schoolId!)
    .eq("slug", categoria)
    .eq("active", true)
    .maybeSingle();
  if (!category) notFound();

  const uids = blocks.flatMap((b) => b.skills.map((s) => skillUid(categoria, b.grade, s.id)));
  let stats = new Map<string, SkillStat>();
  if (ctx.role === "alumno" && ctx.targetId && uids.length > 0) {
    const { data } = await supabase
      .from("game_attempts")
      .select("skill_id, tag, is_correct, answered_at")
      .eq("student_id", ctx.targetId)
      .in("skill_id", uids)
      .order("answered_at", { ascending: false })
      .limit(5000);
    stats = aggregate(data ?? []);
  }

  const total = blocks.reduce((n, b) => n + b.skills.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link href={`/juegos/${categoria}?vista=temas`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          {category.name} · Temas
        </Link>
        <h1 className="text-lg font-medium">
          {found.topic.icon} {found.topic.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {found.competency.name} · {total} juegos · Modo {modeLabel(mode)}
        </p>
      </div>

      {blocks.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay juegos para este tema.</p>}

      {blocks.map((block) => (
        <section key={`${block.grade}/${block.section.id}`} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">
            {block.gradeLabel} · {block.section.icon} {block.section.name}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {block.skills.map((skill) => {
              const uid = skillUid(categoria, block.grade, skill.id);
              const st = stats.get(uid);
              const weak = st && st.total >= MIN_ATTEMPTS && st.accuracy < WEAK_ACCURACY;
              return (
                <Link
                  key={skill.id}
                  href={skillHref(uid)}
                  className="flex items-start justify-between gap-2 rounded-xl border border-border p-3 transition-colors hover:bg-accent"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-sm">{skill.title}</span>
                    {isExtended(getCurriculum(categoria, block.grade)!, skill) && <ExtendedBadge />}
                  </span>
                  {st && (
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                        weak ? "bg-destructive/10 text-destructive" : "bg-brand-green/15 text-brand-green-text"
                      )}
                    >
                      {Math.round(st.accuracy * 100)}%
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
