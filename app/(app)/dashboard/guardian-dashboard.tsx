import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RELATIONSHIP_LABELS } from "@/lib/enum-labels";

export async function GuardianDashboard({
  guardianId,
}: {
  guardianId: string;
}) {
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("student_guardians")
    .select("relationship_type, students(id, code, paternal_surname, maternal_surname, first_names, level, grade, section)")
    .eq("guardian_id", guardianId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-medium">Mis hijos</h1>
        <p className="text-sm text-muted-foreground">
          Alumnos vinculados a tu cuenta
        </p>
      </div>

      {(links ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">
          Todavía no tienes alumnos vinculados.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(links ?? []).map((link) => {
          const student = link.students;
          if (!student) return null;

          return (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>
                  {student.paternal_surname} {student.maternal_surname ?? ""},{" "}
                  {student.first_names}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <p className="text-muted-foreground">
                  {RELATIONSHIP_LABELS[link.relationship_type]} · {student.grade ?? "—"}{" "}
                  {student.section ?? ""}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
