"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { linkStudentsToSections } from "./actions";

export function LinkStudentsButton({ year }: { year: number }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await linkStudentsToSections(year);
      setMessage("error" in result ? result.error : `Se vincularon ${result.linked} alumno(s).`);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" variant="outline" onClick={handleClick} disabled={isPending}>
        {isPending ? "Vinculando…" : "Vincular automáticamente"}
      </Button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
