import { Skeleton } from "@/components/ui/skeleton";

// Las pantallas de Juegos son rejillas de tarjetas (categorías, grados,
// juegos), no tablas: el esqueleto imita esa forma.
export default function Loading() {
  return (
    <div className="flex flex-col gap-8" role="status" aria-label="Cargando">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border p-4">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
