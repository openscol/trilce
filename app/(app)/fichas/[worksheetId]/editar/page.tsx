import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { parseItems } from "@/lib/games/worksheets";
import { WorksheetBuilder } from "../../worksheet-builder";
import type { WorksheetInput } from "../../actions";

export default async function EditarFichaPage(props: PageProps<"/fichas/[worksheetId]/editar">) {
  const { worksheetId } = await props.params;
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/dashboard");

  const supabase = await createClient();
  const { data: w } = await supabase.from("worksheets").select("*").eq("id", worksheetId).maybeSingle();
  if (!w) notFound();

  const initial: WorksheetInput = {
    title: w.title,
    category: w.category as WorksheetInput["category"],
    mode: w.mode as WorksheetInput["mode"],
    items: parseItems(w.items).map(({ skill, count }) => ({ skill, count })),
    includeExplanation: w.include_explanation,
    includeAnswers: w.include_answers,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link href={`/fichas/${w.id}`} className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          {w.title}
        </Link>
        <h1 className="text-lg font-medium">Editar ficha</h1>
        <p className="text-sm text-muted-foreground">Los ejercicios de los temas que no cambias se conservan.</p>
      </div>
      <WorksheetBuilder worksheetId={w.id} initial={initial} />
    </div>
  );
}
