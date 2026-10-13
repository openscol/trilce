import { Skeleton } from "@/components/ui/skeleton";

// Se muestra apenas se hace clic en un enlace del área autenticada, mientras
// el servidor arma la página: así se ve que la navegación ya empezó. Vale para
// todas las pantallas que no tengan su propio loading.tsx.
export default function Loading() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Cargando">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border p-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border p-3 last:border-b-0">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="hidden h-4 w-1/5 sm:block" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
