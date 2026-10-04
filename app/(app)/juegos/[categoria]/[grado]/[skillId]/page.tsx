import { notFound } from "next/navigation";
import { requireAppContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";
import { getSkill, skillUid } from "@/lib/games/catalog";
import { newSeed } from "@/lib/games/rng";
import { classGroupLabel } from "@/lib/class-group";
import { SkillPlayer, type Roster } from "./skill-player";

export default async function SkillPage(props: PageProps<"/juegos/[categoria]/[grado]/[skillId]">) {
  const { categoria, grado, skillId } = await props.params;
  const skill = getSkill(skillUid(categoria, grado, decodeURIComponent(skillId)));
  if (!skill) notFound();
  const ctx = await requireAppContext();

  // Modo un solo dispositivo: el docente elige qué alumno de su sección juega.
  // Los alumnos que ve cada docente ya los limita la RLS de students.
  let roster: Roster | undefined;
  if (["admin", "administrativo", "docente"].includes(ctx.role ?? "")) {
    const supabase = await createClient();
    const [{ data: students }, { data: groups }] = await Promise.all([
      supabase
        .from("students")
        .select("id, code, first_names, paternal_surname, maternal_surname, class_group_id")
        .eq("status", "activo")
        .order("paternal_surname", { ascending: true })
        .limit(1000),
      supabase
        .from("class_groups")
        .select("id, academic_year, level, grade, section")
        .eq("school_id", ctx.schoolId!)
        .order("academic_year", { ascending: false })
        .order("grade", { ascending: true })
        .order("section", { ascending: true }),
    ]);
    const withStudents = new Set((students ?? []).map((s) => s.class_group_id));
    roster = {
      groups: [
        ...(groups ?? []).filter((g) => withStudents.has(g.id)).map((g) => ({ id: g.id, label: classGroupLabel(g) })),
        ...(withStudents.has(null) ? [{ id: "none", label: "Sin sección asignada" }] : []),
      ],
      students: (students ?? []).map((s) => ({
        id: s.id,
        groupId: s.class_group_id ?? "none",
        name: `${s.paternal_surname}${s.maternal_surname ? ` ${s.maternal_surname}` : ""}, ${s.first_names}`,
        code: s.code,
      })),
    };
  }

  return (
    <SkillPlayer
      key={skill.uid}
      skillUid={skill.uid}
      skillId={skill.id}
      title={skill.title}
      sectionName={skill.sectionName}
      gradeLabel={skill.gradeLabel}
      backHref={`/juegos/${categoria}/${grado}#${encodeURIComponent(skill.id)}`}
      sessionLength={skill.sessionLength}
      initialSeed={newSeed()}
      isStudent={ctx.role === "alumno"}
      roster={roster}
    />
  );
}
