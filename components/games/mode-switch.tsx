"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MODES, MODE_COOKIE, type GameMode } from "@/lib/games/modes";
import { cn } from "@/lib/utils";

function saveMode(id: GameMode) {
  document.cookie = `${MODE_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
}

// Selector de modo de los juegos. Se recuerda en una cookie (un año) para que
// el servidor muestre los juegos del modo elegido.
export function ModeSwitch({ mode }: { mode: GameMode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(id: GameMode) {
    saveMode(id);
    startTransition(() => router.refresh());
  }

  return (
    <div className={cn("flex w-fit rounded-lg border border-border p-0.5 text-sm", pending && "opacity-60")} role="radiogroup" aria-label="Modo de juego">
      {MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!m.available || pending}
            title={m.description}
            onClick={() => choose(m.id)}
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1 font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              !m.available && "cursor-not-allowed opacity-50 hover:text-muted-foreground"
            )}
          >
            Modo {m.label}
            {!m.available && <span className="text-xs font-normal">(próximamente)</span>}
          </button>
        );
      })}
    </div>
  );
}
