import { createClient } from "@/lib/supabase/server";
import { LEVEL_LABELS } from "@/app/(app)/alumnos/labels";

export async function StudentDashboard({ studentId }: { studentId: string }) {
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .maybeSingle();

  if (!student) {
    return <p className="text-sm text-muted-foreground">No se encontró tu registro.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-medium">
          {student.paternal_surname} {student.maternal_surname ?? ""},{" "}
          {student.first_names}
        </h1>
        <p className="text-sm text-muted-foreground">
          {student.level ? LEVEL_LABELS[student.level] : "—"} · {student.grade ?? "—"}{" "}
          {student.section ?? ""} · {student.code}
        </p>
      </div>
    </div>
  );
}
