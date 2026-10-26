"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CONDUCT_KINDS, CONDUCT_KIND_LABELS, type ConductCategory, type ConductKind, type ConductNorm } from "@/lib/conduct";
import { deleteCategory, deleteNorm, saveCategory, saveFaltasPerSheet, saveNorm } from "../actions";

const selectClass = "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-sm focus:border-border-brand focus:outline-none";

type Run = (action: () => Promise<{ error: string } | undefined | object>, after?: () => void) => void;

export function NormsEditor({ categories, faltasPerSheet }: { categories: ConductCategory[]; faltasPerSheet: number }) {
  const [limit, setLimit] = useState(String(faltasPerSheet));
  const [newCategory, setNewCategory] = useState<{ name: string; kind: ConductKind }>({ name: "", kind: "falta" });
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const run: Run = (action, after) =>
    start(async () => {
      const result = await action();
      if (result && "error" in result) {
        setMessage({ text: result.error as string, error: true });
        return;
      }
      setMessage(result && "deactivated" in result && result.deactivated ? { text: "La norma ya tenía registros de alumnos: se desactivó en vez de borrarse (su historial se conserva).", error: false } : null);
      after?.();
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border p-4 text-sm">
        <span>Sugerir la ficha de reflexión al llegar a</span>
        <Input type="number" min={1} max={20} value={limit} onChange={(e) => setLimit(e.target.value)} className="h-8 w-16" aria-label="Faltas para la ficha" />
        <span>faltas en el mismo día.</span>
        {Number(limit) !== faltasPerSheet && (
          <Button size="sm" disabled={pending} onClick={() => run(() => saveFaltasPerSheet(Number(limit)))}>
            Guardar
          </Button>
        )}
      </div>

      {message && <p className={cn("text-sm", message.error ? "text-destructive" : "text-muted-foreground")}>{message.text}</p>}

      {categories.map((c) => (
        <CategoryCard key={c.id} category={c} categories={categories} pending={pending} run={run} />
      ))}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border p-4">
        <Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Nuevo tipo de norma" className="h-8 max-w-xs" aria-label="Nombre del nuevo tipo" />
        <select value={newCategory.kind} onChange={(e) => setNewCategory({ ...newCategory, kind: e.target.value as ConductKind })} className={selectClass} aria-label="Qué es">
          {CONDUCT_KINDS.map((k) => (
            <option key={k} value={k}>
              {CONDUCT_KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <Button size="sm" variant="outline" disabled={pending || !newCategory.name.trim()} onClick={() => run(() => saveCategory(newCategory), () => setNewCategory({ name: "", kind: "falta" }))}>
          <PlusIcon />
          Agregar tipo
        </Button>
      </div>
    </div>
  );
}

function CategoryCard({ category, categories, pending, run }: { category: ConductCategory; categories: ConductCategory[]; pending: boolean; run: Run }) {
  const [editing, setEditing] = useState<{ name: string; kind: ConductKind } | null>(null);
  const [newNorm, setNewNorm] = useState("");

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      {editing ? (
        <div className="flex flex-wrap items-center gap-2">
          <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="h-8 max-w-xs" aria-label="Nombre del tipo" />
          <select value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value as ConductKind })} className={selectClass} aria-label="Qué es">
            {CONDUCT_KINDS.map((k) => (
              <option key={k} value={k}>
                {CONDUCT_KIND_LABELS[k]}
              </option>
            ))}
          </select>
          <Button size="sm" disabled={pending} onClick={() => run(() => saveCategory({ id: category.id, ...editing }), () => setEditing(null))}>
            Guardar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-medium">{category.name}</h2>
          <span className="text-xs text-muted-foreground">{CONDUCT_KIND_LABELS[category.kind]}</span>
          <span className="ml-auto flex gap-1">
            <Button size="icon-sm" variant="ghost" aria-label="Editar tipo" onClick={() => setEditing({ name: category.name, kind: category.kind })}>
              <PencilIcon />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Eliminar tipo"
              disabled={pending}
              onClick={() => {
                if (window.confirm(`¿Eliminar el tipo «${category.name}»?`)) run(() => deleteCategory(category.id));
              }}
            >
              <TrashIcon />
            </Button>
          </span>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-border">
        {category.norms.map((n) => (
          <NormRow key={n.id} norm={n} categoryId={category.id} categories={categories} pending={pending} run={run} />
        ))}
        {category.norms.length === 0 && <li className="py-2 text-sm text-muted-foreground">Sin normas.</li>}
      </ul>

      <div className="flex gap-2">
        <Input value={newNorm} onChange={(e) => setNewNorm(e.target.value)} placeholder="Nueva norma" className="h-8" aria-label={`Nueva norma de ${category.name}`} />
        <Button size="sm" variant="outline" disabled={pending || !newNorm.trim()} onClick={() => run(() => saveNorm({ categoryId: category.id, description: newNorm, active: true }), () => setNewNorm(""))}>
          <PlusIcon />
          Agregar
        </Button>
      </div>
    </section>
  );
}

function NormRow({ norm, categoryId, categories, pending, run }: { norm: ConductNorm; categoryId: string; categories: ConductCategory[]; pending: boolean; run: Run }) {
  const [editing, setEditing] = useState<{ description: string; categoryId: string } | null>(null);

  if (editing) {
    return (
      <li className="flex flex-wrap items-center gap-2 py-2">
        <Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="h-8 min-w-48 flex-1" aria-label="Norma" />
        <select value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })} className={selectClass} aria-label="Tipo">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button size="icon-sm" disabled={pending} aria-label="Guardar" onClick={() => run(() => saveNorm({ id: norm.id, categoryId: editing.categoryId, description: editing.description, active: norm.active }), () => setEditing(null))}>
          <CheckIcon />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Cancelar" onClick={() => setEditing(null)}>
          <XIcon />
        </Button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 py-2 text-sm">
      <span className={cn("flex-1", !norm.active && "text-muted-foreground line-through")}>{norm.description}</span>
      <Switch
        checked={norm.active}
        disabled={pending}
        aria-label={norm.active ? "Desactivar norma" : "Activar norma"}
        onCheckedChange={(active) => run(() => saveNorm({ id: norm.id, categoryId, description: norm.description, active }))}
      />
      <Button size="icon-sm" variant="ghost" aria-label="Editar norma" onClick={() => setEditing({ description: norm.description, categoryId })}>
        <PencilIcon />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Eliminar norma"
        disabled={pending}
        onClick={() => {
          if (window.confirm(`¿Eliminar la norma «${norm.description}»?`)) run(() => deleteNorm(norm.id));
        }}
      >
        <TrashIcon />
      </Button>
    </li>
  );
}
