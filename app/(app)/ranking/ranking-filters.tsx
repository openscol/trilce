"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PERIODS = { "7": "Últimos 7 días", "30": "Últimos 30 días", todo: "Desde siempre" };
const ORDERS = { aciertos: "Más aciertos", tiempo: "Más tiempo", juegos: "Más juegos", precision: "Mejor precisión", recientes: "Jugó hace poco" };

export function RankingFilters({
  period,
  order,
  section,
  sections,
  showSections,
}: {
  period: string;
  order?: string;
  section?: string;
  sections?: { id: string; label: string }[];
  showSections?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={period} onValueChange={(v) => v && set("periodo", v)}>
        <SelectTrigger className="w-44" aria-label="Periodo">
          <SelectValue>{PERIODS[period as keyof typeof PERIODS]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PERIODS).map(([k, v]) => (
            <SelectItem key={k} value={k}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showSections && sections && (
        <Select value={section ?? "todas"} onValueChange={(v) => v && set("seccion", v)}>
          <SelectTrigger className="w-56" aria-label="Sección">
            <SelectValue>{section === "todas" || !section ? "Todas las secciones" : (sections.find((s) => s.id === section)?.label ?? "Sección")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las secciones</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {order && (
        <Select value={order} onValueChange={(v) => v && set("orden", v)}>
          <SelectTrigger className="w-44" aria-label="Ordenar por">
            <SelectValue>{ORDERS[order as keyof typeof ORDERS]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORDERS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
