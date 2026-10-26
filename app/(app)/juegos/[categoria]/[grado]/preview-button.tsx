"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, PlayIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getSkill } from "@/lib/games/catalog";
import { makeRng, newSeed } from "@/lib/games/rng";
import { answerText } from "@/lib/games/worksheets";
import { QuestionPreview } from "./[skillId]/example-panel";
import { OptionLabel } from "./[skillId]/option-label";

// «Vista previa»: una pregunta de muestra del juego, para saber de qué trata
// antes de entrar. Solo para mirar: no cuenta para el puntaje ni se guarda.

function Preview({ uid, href }: { uid: string; href: string }) {
  const skill = getSkill(uid);
  const [seed, setSeed] = useState(newSeed);
  const [showAnswer, setShowAnswer] = useState(false);
  const q = useMemo(() => skill?.generate(makeRng(seed)), [skill, seed]);
  if (!skill || !q) return null;

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
        <QuestionPreview q={q} />
        {showAnswer ? (
          <p className="rounded-xl border border-border-brand bg-brand-green/5 p-4 text-sm">
            Respuesta:{" "}
            <span className="font-medium">{q.kind === "choice" && q.blocks ? <OptionLabel text={q.answer} blocks /> : answerText(q)}</span>
            {q.explanation && <span className="mt-1 block text-muted-foreground">{q.explanation}</span>}
          </p>
        ) : (
          <Button type="button" variant="outline" size="sm" className="w-fit self-center" onClick={() => setShowAnswer(true)}>
            Ver la respuesta
          </Button>
        )}
      </div>
      <SheetFooter className="flex-row justify-between border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSeed(newSeed());
            setShowAnswer(false);
          }}
        >
          <RefreshCwIcon />
          Otra pregunta
        </Button>
        <Button nativeButton={false} render={<Link href={href} />}>
          <PlayIcon />
          Jugar
        </Button>
      </SheetFooter>
    </>
  );
}

export function PreviewButton({ uid, href, title, section }: { uid: string; href: string; title: string; section: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
        aria-label={`Vista previa de «${title}»`}
        title="Vista previa"
      >
        <EyeIcon />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full data-[side=right]:sm:max-w-lg">
          <SheetHeader className="pr-12">
            <SheetDescription className="flex items-center gap-1.5">
              <EyeIcon className="size-3.5" />
              Vista previa · {section}
            </SheetDescription>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          {/* Se monta al abrir: la pregunta se genera solo cuando hace falta. */}
          {open && <Preview uid={uid} href={href} />}
        </SheetContent>
      </Sheet>
    </>
  );
}
