import Link from "next/link";
import { BarChart3Icon, SettingsIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { GRADES } from "@/lib/games/grades";
import { skillCount } from "@/lib/games/catalog";
import { Button } from "@/components/ui/button";
import { FreeModeSwitch } from "@/components/games/free-mode";

const STAFF_ROLES = ["admin", "administrativo", "docente"];

export default async function JuegosPage() {
  const ctx = await requireAppContext();
  const isStudent = ctx.role === "alumno";
  const canManage = ctx.role === "admin" || ctx.role === "administrativo";

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("game_categories")
    .select("id, slug, name, icon")
    .eq("school_id", ctx.schoolId!)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Juegos educativos</h1>
          <p className="text-sm text-muted-foreground">
            Elige una categoría y luego el grado. Cada juego genera preguntas nuevas hasta que lo domines
            {isStudent ? " y guarda tus resultados para saber qué repasar." : "."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {STAFF_ROLES.includes(ctx.role ?? "") && <FreeModeSwitch />}
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/juegos/progreso" />}>
            <BarChart3Icon />
            {isStudent ? "Mi progreso" : "Progreso de alumnos"}
          </Button>
          {canManage && (
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/juegos/categorias" />}>
              <SettingsIcon />
              Categorías
            </Button>
          )}
        </div>
      </div>

      {(categories ?? []).length === 0 ? (
        <p className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">
          No hay categorías activas.{canManage && " Créalas en Categorías."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((c) => {
            const total = GRADES.reduce((n, g) => n + skillCount(c.slug, g.key), 0);
            const grades = GRADES.filter((g) => skillCount(c.slug, g.key) > 0).length;
            return (
              <Link
                key={c.id}
                href={`/juegos/${c.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors hover:bg-accent"
              >
                <span className="text-4xl">{c.icon}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {total > 0 ? `${total} juegos · ${grades} ${grades === 1 ? "grado" : "grados"}` : "Próximamente"}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
