"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_SCHOOL_COOKIE } from "@/lib/auth/school-cookie";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_SCHOOL_COOKIE);

  redirect("/login");
}
