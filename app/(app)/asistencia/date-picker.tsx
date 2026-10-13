"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Cambia la fecha (o el mes) de la pantalla por la URL: ?fecha=YYYY-MM-DD o ?mes=YYYY-MM.
export function DatePicker({ date, max, month = false }: { date: string; max?: string; month?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const param = month ? "mes" : "fecha";

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="attendance-date">{month ? "Mes" : "Fecha"}</Label>
      <Input
        id="attendance-date"
        type={month ? "month" : "date"}
        className="w-44"
        value={date}
        max={max}
        onChange={(e) => e.target.value && router.push(`${pathname}?${param}=${e.target.value}`)}
      />
    </div>
  );
}
