import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { loadConductCatalog } from "@/lib/conduct-server";
import { NormsEditor } from "./norms-editor";

export default async function NormasPage() {
  const ctx = await requireAppContext();
  if (ctx.role !== "admin" && ctx.role !== "administrativo") redirect("/faltas");
  const supabase = await createClient();
  const { categories, faltasPerSheet } = await loadConductCatalog(supabase, ctx.schoolId!, true);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/faltas" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="size-4" />
        Registro de faltas
      </Link>
      <div>
        <h1 className="text-lg font-medium">Normas y configuración</h1>
        <p className="text-sm text-muted-foreground">
          Cada tipo dice qué son sus normas: las <b>faltas</b> cuentan para la ficha de reflexión, los <b>registros</b> solo quedan anotados y los <b>permisos</b> se dan uno al día por alumno.
        </p>
      </div>
      <NormsEditor categories={categories} faltasPerSheet={faltasPerSheet} />
    </div>
  );
}
