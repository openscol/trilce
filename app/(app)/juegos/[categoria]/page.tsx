import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { GRADES, LEVELS, gradeKeyFor } from "@/lib/games/grades";
import { skillCount, topicCount } from "@/lib/games/catalog";
import { getCompetencies } from "@/lib/games/topics";
import { getGameMode } from "@/lib/games/mode-server";
import { ModeSwitch } from "@/components/games/mode-switch";
import { cn } from "@/lib/utils";

export default async function CategoriaPage(props: PageProps<"/juegos/[categoria]">) {
  const { categoria } = await props.params;
  const { vista } = await props.searchParams;
  const ctx = await requireAppContext();
  const mode = await getGameMode();
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("game_categories")
    .select("slug, name, icon")
    .eq("school_id", ctx.schoolId!)
    .eq("slug", categoria)
    .eq("active", true)
    .maybeSingle();
  if (!category) notFound();

  const competencies = getCompetencies(category.slug);
  const byTopic = vista === "temas" && competencies.length > 0;

  // Al alumno se le resalta su propio grado.
  let ownGrade: string | undefined;
  if (ctx.role === "alumno" && ctx.targetId) {
    const { data: student } = await supabase.from("students").select("level, grade").eq("id", ctx.targetId).maybeSingle();
    ownGrade = gradeKeyFor(student?.level ?? null, student?.grade ?? null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link href="/juegos" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          Juegos
        </Link>
        <h1 className="text-lg font-medium">
          {category.icon} {category.name}
        </h1>
        <p className="text-sm text-muted-foreground">{byTopic ? "Elige el tema." : "Elige el grado."}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
      <ModeSwitch mode={mode} />
      {competencies.length > 0 && (
        <div className="flex w-fit rounded-lg border border-border p-0.5 text-sm">
          {[
            { label: "Por grados", href: `/juegos/${category.slug}`, active: !byTopic },
            { label: "Por temas", href: `/juegos/${category.slug}?vista=temas`, active: byTopic },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "rounded-md px-3 py-1 font-medium transition-colors",
                tab.active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
      </div>

      {byTopic &&
        competencies.map((c) => (
          <section key={c.id} className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h2 className="text-sm font-medium uppercase text-muted-foreground">
                {c.icon} {c.short}
              </h2>
              <p className="text-xs text-muted-foreground">{c.name}</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {c.topics.map((t) => {
                const count = topicCount(category.slug, t.id, mode);
                const body = (
                  <>
                    <span className="text-sm">
                      {t.icon} {t.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{count > 0 ? `${count} juegos` : "Próximamente"}</span>
                  </>
                );
                const cls = "flex items-center justify-between gap-2 rounded-xl border border-border p-3";
                return count > 0 ? (
                  <Link key={t.id} href={`/juegos/${category.slug}/temas/${t.id}`} className={cn(cls, "transition-colors hover:bg-accent")}>
                    {body}
                  </Link>
                ) : (
                  <div key={t.id} className={cn(cls, "opacity-50")}>
                    {body}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

      {!byTopic && LEVELS.filter((l) => !("extra" in l) || GRADES.some((g) => g.level === l.key && skillCount(category.slug, g.key, mode) > 0)).map(({ key: level, name }) => (
        <section key={level} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">{name}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {GRADES.filter((g) => g.level === level).map((g) => {
              const count = skillCount(category.slug, g.key, mode);
              const own = g.key === ownGrade;
              const body = (
                <>
                  <span className="text-2xl font-medium tabular-nums">{g.short}</span>
                  <span className="text-xs text-muted-foreground">{count > 0 ? `${count} juegos` : "Próximamente"}</span>
                  {own && <span className="text-xs font-medium text-brand-green-text">Tu grado</span>}
                </>
              );
              const cls = cn(
                "flex flex-col items-center gap-1 rounded-2xl border p-4 text-center",
                own ? "border-border-brand" : "border-border"
              );
              return count > 0 ? (
                <Link key={g.key} href={`/juegos/${category.slug}/${g.key}`} className={cn(cls, "transition-colors hover:bg-accent")}>
                  {body}
                </Link>
              ) : (
                <div key={g.key} className={cn(cls, "opacity-50")}>
                  {body}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
