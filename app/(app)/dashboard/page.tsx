import { createClient } from "@/lib/supabase/server";
import { requireAppContext } from "@/lib/auth/context";
import { GuardianDashboard } from "./guardian-dashboard";
import { StudentDashboard } from "./student-dashboard";
import { SchoolFeed } from "@/components/feed/school-feed";

export default async function DashboardPage() {
  const ctx = await requireAppContext();

  if (ctx.role === "padre" && ctx.targetId) {
    return (
      <div className="flex flex-col gap-8">
        <GuardianDashboard guardianId={ctx.targetId} />
        <SchoolFeed ctx={ctx} />
      </div>
    );
  }

  if (ctx.role === "alumno" && ctx.targetId) {
    return (
      <div className="flex flex-col gap-8">
        <StudentDashboard studentId={ctx.targetId} />
        <SchoolFeed ctx={ctx} />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Sesión iniciada como {user?.email}
        {ctx.role === "docente" && " — revisa tus alumnos en Alumnos."}
      </p>
      <SchoolFeed ctx={ctx} />
    </div>
  );
}
