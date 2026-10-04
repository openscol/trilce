"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { TrashIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createCategory, deleteCategory, updateCategory, type FormState } from "./actions";
import type { CategoryRow } from "./category-list";

export function CategorySheet({
  category,
  open,
  onOpenChange,
}: {
  category: CategoryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {open && <CategorySheetBody key={category?.id ?? "new"} category={category} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function CategorySheetBody({ category, onDone }: { category: CategoryRow | null; onDone: () => void }) {
  const action = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const submittedRef = useRef(false);
  useEffect(() => {
    if (pending) {
      submittedRef.current = true;
    } else if (submittedRef.current && !state?.error) {
      onDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  function handleDelete() {
    if (!category) return;
    startDelete(async () => {
      const result = await deleteCategory(category.id);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{category ? "Editar categoría" : "Nueva categoría"}</SheetTitle>
        <SheetDescription>{category ? category.name : "Agrupa juegos por área: Comunicación, Computación…"}</SheetDescription>
      </SheetHeader>

      <form id="category-form" action={formAction} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={category?.name} placeholder="Ej. Comunicación" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="icon">Ícono (emoji)</Label>
            <Input id="icon" name="icon" defaultValue={category?.icon ?? "🎮"} maxLength={8} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sort_order">Orden</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Identificador</Label>
          {category ? (
            <p className="font-mono text-sm">{category.slug}</p>
          ) : (
            <Input id="slug" name="slug" placeholder="Se genera del nombre" />
          )}
          <p className="text-xs text-muted-foreground">
            Enlaza la categoría con sus juegos programados. No cambia al renombrarla.
          </p>
        </div>
        {category && (
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="active">Activa (visible en Juegos)</Label>
            <Switch id="active" name="active" defaultChecked={category.active} />
          </div>
        )}

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
      </form>

      <SheetFooter className="flex-row justify-between">
        {category ? (
          <AlertDialog>
            <AlertDialogTrigger render={<Button type="button" variant="outline" disabled={isDeleting} />}>
              <TrashIcon />
              Eliminar
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dejará de aparecer en Juegos. El progreso de los alumnos no se borra: si vuelves a crear una categoría
                  con el identificador “{category.slug}”, reaparece. Para ocultarla sin borrarla, desactívala.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <span />
        )}
        <Button type="submit" form="category-form" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
      </SheetFooter>
    </>
  );
}
