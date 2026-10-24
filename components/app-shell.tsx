"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BuildingIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  Gamepad2Icon,
  ScanLineIcon,
  IdCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  PanelLeftIcon,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  { href: "/asistencia", label: "Asistencia", icon: CalendarCheckIcon },
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
  { href: "/asistencia", label: "Asistencia", icon: CalendarCheckIcon },
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

type SidebarMode = "expanded" | "collapsed" | "hover";

const SIDEBAR_MODE_KEY = "trilce.sidebar-mode";

const SIDEBAR_MODES: { value: SidebarMode; label: string }[] = [
  { value: "expanded", label: "Expandida" },
  { value: "collapsed", label: "Contraída" },
  { value: "hover", label: "Expandir al pasar el cursor" },
];

function isSidebarMode(value: unknown): value is SidebarMode {
  return SIDEBAR_MODES.some((m) => m.value === value);
}

// Modo de la barra lateral, recordado en este navegador.
const sidebarListeners = new Set<() => void>();

function readSidebarMode(): SidebarMode {
  try {
    const saved = localStorage.getItem(SIDEBAR_MODE_KEY);
    return isSidebarMode(saved) ? saved : "expanded";
  } catch {
    return "expanded";
  }
}

function subscribeSidebarMode(listener: () => void) {
  sidebarListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    sidebarListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setSidebarMode(value: unknown) {
  if (!isSidebarMode(value)) return;
  try {
    localStorage.setItem(SIDEBAR_MODE_KEY, value);
  } catch {
    // Sin almacenamiento disponible: el modo simplemente no se recuerda.
  }
  sidebarListeners.forEach((l) => l());
}

const itemClass =
  "flex items-center gap-2 overflow-hidden rounded-lg border-l-2 border-transparent px-3 py-2 text-sm whitespace-nowrap text-secondary-foreground transition-colors";

function NavLinks({
  items,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto p-2">
      {items.map((item) => {
        const active = pathname.startsWith(item.matchPrefix ?? item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              itemClass,
              active
                ? "border-l-primary bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOutButton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      title={collapsed ? "Cerrar Sesión" : undefined}
      className={cn(
        itemClass,
        "w-full text-left hover:bg-destructive/10 hover:text-destructive"
      )}
    >
      <LogOutIcon className="size-4 shrink-0" />
      {!collapsed && "Cerrar Sesión"}
    </button>
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

  // Control de la barra lateral (como en Supabase).
  const sidebarMode = useSyncExternalStore(subscribeSidebarMode, readSidebarMode, () => "expanded" as const);
  const [hovered, setHovered] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);

  const sidebarExpanded =
    sidebarMode === "expanded" ||
    (sidebarMode === "hover" && (hovered || controlOpen));

  return (
    <div className="flex min-h-screen">
      {/* El contenedor reserva el ancho; en modo "al pasar el cursor" la
          barra se expande por encima del contenido sin desplazarlo. */}
      <div
        className={cn(
          "sticky top-0 z-40 hidden h-screen shrink-0 transition-[width] duration-200 md:block print:hidden",
          sidebarMode === "expanded" ? "w-56" : "w-14"
        )}
      >
        <aside
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "absolute inset-y-0 left-0 flex flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-200",
            sidebarExpanded ? "w-56" : "w-14"
          )}
        >
          <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
            <span className="text-sm font-medium whitespace-nowrap">
              {sidebarExpanded ? "Trilce" : "T"}
            </span>
          </div>
          <NavLinks
            items={navItems}
            pathname={pathname}
            collapsed={!sidebarExpanded}
          />
          <div className="flex shrink-0 flex-col gap-1 border-t border-border p-2">
            <SignOutButton collapsed={!sidebarExpanded} />
            <DropdownMenu open={controlOpen} onOpenChange={setControlOpen}>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Control de la barra lateral"
                    title="Control de la barra lateral"
                    className={cn(
                      itemClass,
                      "w-full text-left hover:bg-accent hover:text-accent-foreground"
                    )}
                  />
                }
              >
                <PanelLeftIcon className="size-4 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-64">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Control de la barra lateral</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={sidebarMode}
                    onValueChange={setSidebarMode}
                  >
                    {SIDEBAR_MODES.map((m) => (
                      <DropdownMenuRadioItem key={m.value} value={m.value}>
                        {m.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64 gap-0 bg-card p-0 md:hidden">
          <div className="flex h-14 items-center border-b border-border px-4">
            <SheetTitle className="text-sm font-medium">Trilce</SheetTitle>
          </div>
          <NavLinks items={navItems} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          <div className="border-t border-border p-2">
            <SignOutButton />
          </div>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 print:p-0">{children}</main>
      </div>
    </div>
  );
}
