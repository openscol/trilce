// Círculo con las iniciales: el muro no usa fotos de perfil.
export function InitialsAvatar({ name, small }: { name: string; small?: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-full border border-border bg-muted font-medium text-muted-foreground ${small ? "size-8 text-xs" : "size-10 text-sm"}`}>
      {initials || "?"}
    </span>
  );
}
