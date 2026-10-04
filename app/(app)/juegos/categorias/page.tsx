import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { hasContent } from "@/lib/games/catalog";
import { CategoryList } from "./category-list";

export default async function CategoriasPage() {
  const ctx = await requireAppContext();
  if (ctx.role !== "admin" && ctx.role !== "administrativo") redirect("/juegos");

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("game_categories")
    .select("*")
    .eq("school_id", ctx.schoolId!)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link href="/juegos" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          Juegos
        </Link>
        <h1 className="text-lg font-medium">Categorías de juegos</h1>
        <p className="text-sm text-muted-foreground">
          Matemáticas, Comunicación, Computación… Una categoría sin juegos programados aparece como “Próximamente”.
        </p>
      </div>
      <CategoryList
        categories={(categories ?? []).map((c) => ({ ...c, hasContent: hasContent(c.slug) }))}
      />
    </div>
  );
}
