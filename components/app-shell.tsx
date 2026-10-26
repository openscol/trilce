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
  ClipboardXIcon,
  FileTextIcon,
  Gamepad2Icon,
  TrophyIcon,
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
  Volume2Icon,
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

// El menú va por secciones (como en Supabase): con veinte opciones en una sola
// lista no se encuentra nada.
type NavSection = { label?: string; items: NavItem[] };

const DASHBOARD: NavItem = { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon };
const ALUMNOS: NavItem = { href: "/alumnos", label: "Alumnos", icon: UsersIcon };
const HORARIO: NavItem = { href: "/horario", label: "Horario", icon: CalendarDaysIcon };
const ACCOUNT_ITEM: NavItem = { href: "/mi-cuenta", label: "Mi Cuenta", icon: ShieldIcon };

const CLASSROOM: NavItem[] = [
  HORARIO,
  { href: "/asistencia", label: "Asistencia", icon: CalendarCheckIcon },
  { href: "/faltas", label: "Registro de faltas", icon: ClipboardXIcon },
  { href: "/semaforo", label: "Semáforo de ruido", icon: Volume2Icon },
];

const LEARNING: NavItem[] = [
  { href: "/cuestionarios", label: "Cuestionarios", icon: ClipboardListIcon },
  { href: "/examenes", label: "Exámenes", icon: ScanLineIcon },
  { href: "/juegos", label: "Juegos", icon: Gamepad2Icon },
  { href: "/ranking", label: "Ranking de jugadores", icon: TrophyIcon },
  { href: "/fichas", label: "Fichas", icon: FileTextIcon },
];

function staffNav(isAdmin: boolean): NavSection[] {
  return [
    { items: [DASHBOARD] },
    {
      label: "Comunidad",
      items: [
        ALUMNOS,
        { href: "/apoderados", label: "Apoderados", icon: UserRoundIcon },
        { href: "/personal", label: "Personal", icon: IdCardIcon },
        ...(isAdmin ? [{ href: "/miembros", label: "Miembros", icon: UsersRoundIcon }] : []),
      ],
    },
    { label: "Aula", items: CLASSROOM },
    { label: "Aprendizaje", items: LEARNING },
    {
      label: "Tesorería",
      items: [
        { href: "/cobros", label: "Cobros", icon: ReceiptTextIcon },
        { href: "/registrar-pago", label: "Registrar Pago", icon: CircleDollarSignIcon },
      ],
    },
    {
      label: "Ajustes",
      items: [{ href: "/configuracion/precios", matchPrefix: "/configuracion", label: "Configuración", icon: SettingsIcon }, ACCOUNT_ITEM],
    },
  ];
}

const DOCENTE_NAV: NavSection[] = [
  { items: [DASHBOARD, ALUMNOS] },
  { label: "Aula", items: CLASSROOM },
  { label: "Aprendizaje", items: LEARNING },
  { label: "Ajustes", items: [ACCOUNT_ITEM] },
];

const FAMILY_NAV: NavSection[] = [
  { items: [DASHBOARD] },
  {
    label: "Colegio",
    items: [
      HORARIO,
      { href: "/faltas", label: "Faltas y permisos", icon: ClipboardXIcon },
      { href: "/examenes", label: "Exámenes", icon: ScanLineIcon },
      { href: "/juegos", label: "Juegos", icon: Gamepad2Icon },
      { href: "/ranking", label: "Ranking de jugadores", icon: TrophyIcon },
    ],
  },
  { label: "Ajustes", items: [ACCOUNT_ITEM] },
];

const PLATFORM_NAV: NavSection[] = [
  { items: [{ href: "/plataforma", label: "Colegios", icon: BuildingIcon }] },
  { label: "Ajustes", items: [ACCOUNT_ITEM] },
];

function navForRole(role: AppContext["role"], isPlatformStaff: boolean): NavSection[] {
  if (isPlatformStaff) return PLATFORM_NAV;
  if (role === "admin" || role === "administrativo") return staffNav(role === "admin");
  if (role === "docente") return DOCENTE_NAV;
  // padre y alumno: lo de sus hijos / lo propio
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

// Altura fija (h-9) y shrink-0: en pantallas bajas el menú hace scroll en vez
// de aplastar los ítems.
const itemClass =
  "flex h-9 shrink-0 items-center gap-3 overflow-hidden rounded-lg border-l-2 border-transparent px-3 text-sm whitespace-nowrap text-secondary-foreground transition-colors";

function NavLinks({
  sections,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  sections: NavSection[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-2 py-3 [scrollbar-width:thin]">
      {sections.map((section, i) => (
        <div key={section.label ?? i} className="flex flex-col gap-0.5">
          {section.label &&
            (collapsed ? (
              <span className="mx-3 mb-1 h-px shrink-0 bg-border" aria-hidden="true" />
            ) : (
              <span className="flex h-6 shrink-0 items-center px-3 text-xs whitespace-nowrap text-muted-foreground uppercase">{section.label}</span>
            ))}
          {section.items.map((item) => {
            const active = pathname.startsWith(item.matchPrefix ?? item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(itemClass, active ? "border-l-primary bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground")}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
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
  const navSections = navForRole(role, isPlatformStaff);
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
          "sticky top-0 z-40 hidden h-dvh shrink-0 transition-[width] duration-200 md:block print:hidden",
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
            sections={navSections}
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
          <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
            <SheetTitle className="text-sm font-medium">Trilce</SheetTitle>
          </div>
          <NavLinks sections={navSections} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          <div className="shrink-0 border-t border-border p-2">
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
