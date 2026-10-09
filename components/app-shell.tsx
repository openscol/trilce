"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BuildingIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  Gamepad2Icon,
  ScanLineIcon,
  IdCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ReceiptTextIcon,
  SettingsIcon,
  ShieldIcon,
  UsersRoundIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(app)/actions";
import type { AppContext } from "@/lib/auth/context";

type NavItem = {
  href: string;
  matchPrefix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STAFF_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/alumnos", label: "Alumnos", icon: UsersIcon },
  { href: "/apoderados", label: "Apoderados", icon: UserRoundIcon },
  { href: "/personal", label: "Personal", icon: IdCardIcon },
  { href: "/horario", label: "Horario", icon: CalendarDaysIcon },
  { href: "/cuestionarios", label: "Cuestionarios", icon: ClipboardListIcon },
  { href: "/examenes", label: "Exámenes", icon: ScanLineIcon },
  { href: "/juegos", label: "Juegos", icon: Gamepad2Icon },
  { href: "/cobros", label: "Cobros", icon: ReceiptTextIcon },
  {
    href: "/registrar-pago",
    label: "Registrar Pago",
    icon: CircleDollarSignIcon,
  },
  {
    href: "/configuracion/precios",
    matchPrefix: "/configuracion",
    label: "Configuración",
    icon: SettingsIcon,
  },
];

const DOCENTE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/alumnos", label: "Alumnos", icon: UsersIcon },
  { href: "/horario", label: "Horario", icon: CalendarDaysIcon },
  { href: "/cuestionarios", label: "Cuestionarios", icon: ClipboardListIcon },
  { href: "/examenes", label: "Exámenes", icon: ScanLineIcon },
  { href: "/juegos", label: "Juegos", icon: Gamepad2Icon },
];

const FAMILY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/horario", label: "Horario", icon: CalendarDaysIcon },
  { href: "/examenes", label: "Exámenes", icon: ScanLineIcon },
  { href: "/juegos", label: "Juegos", icon: Gamepad2Icon },
];

const PLATFORM_NAV: NavItem[] = [
  { href: "/plataforma", label: "Colegios", icon: BuildingIcon },
];

const ACCOUNT_ITEM: NavItem = {
  href: "/mi-cuenta",
  label: "Mi Cuenta",
  icon: ShieldIcon,
};

function navForRole(
  role: AppContext["role"],
  isPlatformStaff: boolean
): NavItem[] {
  if (isPlatformStaff) return PLATFORM_NAV;
  if (role === "admin") {
    return [
      ...STAFF_NAV,
      { href: "/miembros", label: "Miembros", icon: UsersRoundIcon },
    ];
  }
  if (role === "administrativo") return STAFF_NAV;
  if (role === "docente") return DOCENTE_NAV;
  // padre y alumno: solo su propio dashboard
  return FAMILY_NAV;
}

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-2">
      {items.map((item) => {
        const active = pathname.startsWith(item.matchPrefix ?? item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-secondary-foreground transition-colors",
              active
                ? "border-l-primary bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  schoolName,
  email,
  displayName,
  role,
  isPlatformStaff,
  children,
}: {
  schoolName: string | null;
  email: string | null;
  displayName: string;
  role: AppContext["role"];
  isPlatformStaff: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = [...navForRole(role, isPlatformStaff), ACCOUNT_ITEM];
  // En pantallas angostas el menú vive en un panel que se abre con ☰.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex print:hidden">
        <div className="flex h-14 items-center border-b border-border px-4">
          <span className="text-sm font-medium">Trilce</span>
        </div>
        <NavLinks items={navItems} pathname={pathname} />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64 gap-0 bg-card p-0 md:hidden">
          <div className="flex h-14 items-center border-b border-border px-4">
            <SheetTitle className="text-sm font-medium">Trilce</SheetTitle>
          </div>
          <NavLinks items={navItems} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-2 border-b border-border px-4 md:px-6 print:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <MenuIcon />
            </Button>
            <span className="truncate text-sm font-medium text-secondary-foreground">
              {schoolName ?? "Plataforma"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full" />
                }
              >
                <Avatar className="size-8">
                  <AvatarFallback>
                    {displayName[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="font-medium">{displayName}</span>
                    {email && (
                      <span className="font-normal text-muted-foreground">
                        {email}
                      </span>
                    )}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/mi-cuenta" />}>
                  <SettingsIcon />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut()}
                >
                  <LogOutIcon />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 print:p-0">{children}</main>
      </div>
    </div>
  );
}
