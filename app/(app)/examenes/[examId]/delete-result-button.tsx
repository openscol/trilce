"use client";

import { useTransition } from "react";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExamResult } from "../actions";

export function DeleteResultButton({ examId, resultId }: { examId: string; resultId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      title="Eliminar esta ficha"
      onClick={() => {
        if (!window.confirm("¿Eliminar la ficha de este alumno? Podrás volver a procesarla.")) return;
        start(async () => {
          const result = await deleteExamResult(examId, resultId);
          if (result?.error) window.alert(result.error);
        });
      }}
    >
      <TrashIcon />
    </Button>
  );
}
