import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABEL, parseItems } from "@/lib/games/worksheets";
import { DeleteWorksheetButton } from "../delete-worksheet-button";
import { DownloadPdfButton, WorksheetDocument } from "./worksheet-document";

export default async function FichaPage(props: PageProps<"/fichas/[worksheetId]">) {
  const { worksheetId } = await props.params;
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/dashboard");

  const supabase = await createClient();
  const { data: w } = await supabase.from("worksheets").select("*").eq("id", worksheetId).maybeSingle();
  if (!w) notFound();
  const items = parseItems(w.items);
  const total = items.reduce((n, it) => n + it.count, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div className="flex flex-col gap-1">
          <Link href="/fichas" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="size-3.5" />
            Fichas
          </Link>
          <h1 className="text-lg font-medium">{w.title}</h1>
          <p className="text-sm text-muted-foreground">
            {CATEGORY_LABEL[w.category] ?? w.category} · {total} ejercicios
            {w.include_explanation ? " · con explicación" : ""}
            {w.include_answers ? " · con respuestas" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadPdfButton title={w.title} />
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/fichas/${w.id}/editar`} />}>
            <PencilIcon />
            Editar
          </Button>
          <DeleteWorksheetButton id={w.id} withLabel redirectTo="/fichas" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground print:hidden">Para descargar: «Descargar PDF» y en la ventana de impresión elige «Guardar como PDF».</p>
      <WorksheetDocument title={w.title} schoolName={ctx.schoolName} items={items} includeExplanation={w.include_explanation} includeAnswers={w.include_answers} />
    </div>
  );
}
