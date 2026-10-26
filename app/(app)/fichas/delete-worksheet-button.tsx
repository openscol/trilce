"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteWorksheet } from "./actions";

export function DeleteWorksheetButton({ id, withLabel, redirectTo }: { id: string; withLabel?: boolean; redirectTo?: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      type="button"
      variant={withLabel ? "outline" : "ghost"}
      size={withLabel ? "sm" : "icon-sm"}
      disabled={pending}
      title="Eliminar"
      onClick={() => {
        if (!window.confirm("¿Eliminar esta ficha? No se puede deshacer.")) return;
        start(async () => {
          const result = await deleteWorksheet(id);
          if (result?.error) window.alert(result.error);
          else if (redirectTo) router.push(redirectTo);
        });
      }}
    >
      <TrashIcon />
      {withLabel && "Eliminar"}
    </Button>
  );
}
