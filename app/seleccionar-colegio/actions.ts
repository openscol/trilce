"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_SCHOOL_COOKIE, ACTIVE_SCHOOL_COOKIE_OPTIONS } from "@/lib/auth/school-cookie";
import { createClient } from "@/lib/supabase/server";

export async function selectSchool(schoolId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("school_id")
    .eq("user_id", user.id)
    .eq("school_id", schoolId)
    .eq("active", true)
    .maybeSingle();

  if (!membership) {
    redirect("/seleccionar-colegio");
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_SCHOOL_COOKIE, schoolId, ACTIVE_SCHOOL_COOKIE_OPTIONS);

  redirect("/dashboard");
}
