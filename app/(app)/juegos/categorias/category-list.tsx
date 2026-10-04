"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GameCategory } from "./actions";
import { CategorySheet } from "./category-sheet";

export type CategoryRow = GameCategory & { hasContent: boolean };

export function CategoryList({ categories }: { categories: CategoryRow[] }) {
  const [sheetItem, setSheetItem] = useState<CategoryRow | "new" | null>(null);

  return (
    <>
      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-end border-b border-border p-3">
          <Button size="sm" onClick={() => setSheetItem("new")}>
            <PlusIcon />
            Nueva categoría
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Identificador</TableHead>
              <TableHead>Juegos</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Todavía no hay categorías.
                </TableCell>
              </TableRow>
            )}
            {categories.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setSheetItem(c)}>
                <TableCell className="font-mono text-xs">{c.sort_order}</TableCell>
                <TableCell>
                  {c.icon} {c.name}
                </TableCell>
                <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                <TableCell className="text-muted-foreground">{c.hasContent ? "Programados" : "Próximamente"}</TableCell>
                <TableCell>
                  <Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Activa" : "Inactiva"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategorySheet
        category={sheetItem === "new" ? null : sheetItem}
        open={sheetItem !== null}
        onOpenChange={(open) => !open && setSheetItem(null)}
      />
    </>
  );
}
