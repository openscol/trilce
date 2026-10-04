import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { getCurriculum, skillHref, skillUid } from "@/lib/games/catalog";
import { getGrade } from "@/lib/games/grades";
import { aggregate, MIN_ATTEMPTS, WEAK_ACCURACY, type SkillStat } from "@/lib/games/stats";
import { cn } from "@/lib/utils";

export default async function GradoPage(props: PageProps<"/juegos/[categoria]/[grado]">) {
  const { categoria, grado } = await props.params;
  const ctx = await requireAppContext();
  const grade = getGrade(grado);
  const curriculum = getCurriculum(categoria, grado);
  if (!grade || !curriculum) notFound();

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("game_categories")
    .select("name, icon")
    .eq("school_id", ctx.schoolId!)
    .eq("slug", categoria)
    .eq("active", true)
    .maybeSingle();
  if (!category) notFound();

  const isStudent = ctx.role === "alumno" && ctx.targetId;
  let stats = new Map<string, SkillStat>();
  if (isStudent) {
    const { data } = await supabase
      .from("game_attempts")
      .select("skill_id, tag, is_correct, answered_at")
      .eq("student_id", ctx.targetId!)
      .like("skill_id", `${categoria}/${grado}/%`)
      .order("answered_at", { ascending: false })
      .limit(5000);
    stats = aggregate(data ?? []);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link href={`/juegos/${categoria}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          {category.name}
        </Link>
        <h1 className="text-lg font-medium">
          {category.icon} {category.name} · {grade.label}
        </h1>
        <p className="text-sm text-muted-foreground">{curriculum.skills.length} juegos</p>
      </div>

      {curriculum.sections.map((section) => {
        const skills = curriculum.skills.filter((s) => s.section === section.id);
        if (skills.length === 0) return null;
        return (
          <section key={section.id} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium uppercase text-muted-foreground">
              {section.icon} {section.id}. {section.name}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => {
                const uid = skillUid(categoria, grado, skill.id);
                const st = stats.get(uid);
                const weak = st && st.total >= MIN_ATTEMPTS && st.accuracy < WEAK_ACCURACY;
                return (
                  <Link
                    key={skill.id}
                    id={skill.id}
                    href={skillHref(uid)}
                    className="flex scroll-mt-24 items-start justify-between gap-2 rounded-xl border border-border p-3 transition-colors hover:bg-accent"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs text-muted-foreground">{skill.id}</span>
                      <span className="text-sm">{skill.title}</span>
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
        );
      })}
    </div>
  );
}
