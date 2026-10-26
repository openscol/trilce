import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { parseItems } from "@/lib/games/worksheets";
import { WorksheetList } from "./worksheet-list";

export default async function FichasPage() {
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("worksheets")
    .select("id, title, category, items, created_at, staff_members(full_name)")
    .order("created_at", { ascending: false });

  const worksheets = (data ?? []).map((w) => ({
    id: w.id,
    title: w.title,
    category: w.category,
    items: parseItems(w.items),
    createdAt: w.created_at,
    author: w.staff_members?.full_name ?? null,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium">Fichas</h1>
          <p className="text-sm text-muted-foreground">Arma fichas de ejercicios con los juegos y descárgalas en PDF para tus alumnos.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/fichas/nueva" />}>
          <PlusIcon />
          Nueva ficha
        </Button>
      </div>
      <WorksheetList worksheets={worksheets} />
    </div>
  );
}
