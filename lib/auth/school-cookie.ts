// Cookie con el colegio en el que opera el usuario. Debe durar tanto como la
// sesión de Supabase: sin maxAge sería una cookie de sesión, que el navegador
// borra al cerrarse mientras la sesión sigue viva, y el usuario volvía sin colegio.
export const ACTIVE_SCHOOL_COOKIE = "active_school_id";

export const ACTIVE_SCHOOL_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;
