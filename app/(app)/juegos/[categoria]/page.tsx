import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { GRADES, LEVELS, gradeKeyFor } from "@/lib/games/grades";
import { skillCount } from "@/lib/games/catalog";
import { cn } from "@/lib/utils";

export default async function CategoriaPage(props: PageProps<"/juegos/[categoria]">) {
  const { categoria } = await props.params;
  const ctx = await requireAppContext();
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("game_categories")
    .select("slug, name, icon")
    .eq("school_id", ctx.schoolId!)
    .eq("slug", categoria)
    .eq("active", true)
    .maybeSingle();
  if (!category) notFound();

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
        <p className="text-sm text-muted-foreground">Elige el grado.</p>
      </div>

      {LEVELS.map(({ key: level, name }) => (
        <section key={level} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase text-muted-foreground">{name}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {GRADES.filter((g) => g.level === level).map((g) => {
              const count = skillCount(category.slug, g.key);
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
