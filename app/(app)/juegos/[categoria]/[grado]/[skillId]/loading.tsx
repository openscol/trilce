import { Skeleton } from "@/components/ui/skeleton";

// Esqueleto del juego: título, barra de avance, pregunta con dibujo y opciones.
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8" role="status" aria-label="Cargando el juego">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-72 max-w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border p-8">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="size-32 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
