import ExcelJS from "exceljs";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { LEVEL_LABELS } from "@/lib/enum-labels";
import { ATTENDANCE_LABELS, ATTENDANCE_STATUSES, SIAGIE_CODES, monthLabel, parseMonthParam } from "@/lib/attendance";
import { loadMonthlyReport } from "@/lib/attendance-report";

// Excel del mes con el mismo armado del registro mensual de asistencia del
// SIAGIE: una fila por alumno, una columna por día y las letras de
// SIAGIE_CODES. Sirve para copiar las marcas a la plantilla que se descarga
// del SIAGIE (esa plantilla trae sus propios códigos internos por alumno).
export async function GET(request: Request, { params }: { params: Promise<{ grupo: string }> }) {
  const ctx = await requireAppContext();
  const { grupo } = await params;
  const month = parseMonthParam(new URL(request.url).searchParams.get("mes") ?? undefined);
  const supabase = await createClient();

  const { data: group } = await supabase.from("class_groups").select("level, grade, section").eq("id", grupo).eq("school_id", ctx.schoolId!).maybeSingle();
  if (!group) return new Response("Sección no encontrada", { status: 404 });

  const report = await loadMonthlyReport(supabase, grupo, month);
  if (!report) return new Response("No autorizado", { status: 403 });

  const section = `${LEVEL_LABELS[group.level]} ${group.grade}${group.section}`;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Asistencia", { views: [{ state: "frozen", xSplit: 4, ySplit: 5 }] });

  const fixed = ["N.°", "Código", "DNI", "Apellidos y nombres"];
  const totals = ["Asistencias", "Tardanzas", "Tard. justificadas", "Faltas", "Faltas justificadas"];
  const lastColumn = fixed.length + report.days.length + totals.length;

  sheet.addRow([ctx.schoolName ?? "Colegio"]);
  sheet.addRow([`Registro de asistencia — ${section}`]);
  sheet.addRow([`Mes: ${monthLabel(month)}`]);
  sheet.addRow([]);
  for (const r of [1, 2, 3]) {
    sheet.mergeCells(r, 1, r, lastColumn);
    sheet.getRow(r).font = { bold: r < 3, size: r === 1 ? 13 : 11 };
  }

  const header = sheet.addRow([...fixed, ...report.days.map((d) => d.day), ...totals]);
  header.font = { bold: true };
  header.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

  report.rows.forEach((row, i) => {
    const t = row.totals;
    sheet.addRow([i + 1, row.code, row.documentNumber ?? "", row.name, ...report.days.map((d) => (row.marks[d.iso] ? SIAGIE_CODES[row.marks[d.iso]] : "")), t.presente, t.tardanza, t.tardanza_justificada, t.falta, t.falta_justificada]);
  });

  sheet.getColumn(1).width = 5;
  sheet.getColumn(2).width = 12;
  sheet.getColumn(3).width = 12;
  sheet.getColumn(4).width = 38;
  report.days.forEach((d, i) => {
    const column = sheet.getColumn(fixed.length + 1 + i);
    column.width = 4;
    column.alignment = { horizontal: "center" };
    if (d.weekend) {
      for (let r = 5; r <= 5 + report.rows.length; r++) sheet.getCell(r, fixed.length + 1 + i).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E5E5" } };
    }
  });
  totals.forEach((_, i) => {
    const column = sheet.getColumn(fixed.length + report.days.length + 1 + i);
    column.width = 13;
    column.alignment = { horizontal: "center" };
  });
  sheet.getColumn(4).alignment = { horizontal: "left" };
  header.getCell(4).alignment = { horizontal: "left", vertical: "middle" };

  const thin = { style: "thin" as const, color: { argb: "FFBFBFBF" } };
  for (let r = 5; r <= 5 + report.rows.length; r++) {
    for (let c = 1; c <= lastColumn; c++) sheet.getCell(r, c).border = { top: thin, left: thin, bottom: thin, right: thin };
  }

  sheet.addRow([]);
  sheet.addRow([`Leyenda: ${ATTENDANCE_STATUSES.map((s) => `${SIAGIE_CODES[s]} = ${ATTENDANCE_LABELS[s]}`).join("; ")}. Casilla vacía = ese día no se pasó lista.`]);

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `asistencia-${section.replace(/\s+/g, "-").toLowerCase()}-${month}.xlsx`;
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  });
}
