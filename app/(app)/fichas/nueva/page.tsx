import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { requireAppContext } from "@/lib/auth/context";
import { WorksheetBuilder } from "../worksheet-builder";

export default async function NuevaFichaPage() {
  const ctx = await requireAppContext();
  if (!["admin", "administrativo", "docente"].includes(ctx.role ?? "")) redirect("/dashboard");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link href="/fichas" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-3.5" />
          Fichas
        </Link>
        <h1 className="text-lg font-medium">Nueva ficha</h1>
      </div>
      <WorksheetBuilder />
    </div>
  );
}
