import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Wordmark } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { TOURNAMENT } from "@/data/mundial";
import {
  LayoutDashboard,
  CalendarDays,
  Percent,
  Radio,
  Trophy,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Tauler", icon: LayoutDashboard, testid: "nav-tauler" },
  { href: "/calendari", label: "Calendari", icon: CalendarDays, testid: "nav-calendari" },
  { href: "/probabilitats", label: "Probabilitats", icon: Percent, testid: "nav-probabilitats" },
  { href: "/seguiment", label: "Seguiment", icon: Radio, testid: "nav-seguiment" },
  { href: "/grups", label: "Grups", icon: Trophy, testid: "nav-grups" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="flex flex-col gap-1" aria-label="Navegació principal">
      {NAV.map(({ href, label, icon: Icon, testid }) => {
        const active = location === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            data-testid={testid}
            className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/75 hover-elevate"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      data-testid="button-theme"
      aria-label={theme === "dark" ? "Mode clar" : "Mode fosc"}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border text-sidebar-foreground/80 hover-elevate"
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-[100dvh] overflow-hidden bg-background lg:grid lg:grid-cols-[256px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:border-r lg:border-sidebar-border">
        <div className="flex items-center px-5 py-5 text-sidebar-foreground">
          <Wordmark />
        </div>
        <div className="flex-1 overflow-y-auto px-3" style={{ overscrollBehavior: "contain" }}>
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
              Tema
            </span>
            <ThemeToggle />
          </div>
          <div className="rounded-md bg-sidebar-accent/60 px-3 py-2.5 text-[11px] leading-relaxed text-sidebar-foreground/75">
            <span className="font-semibold text-amber-400">Mode demo</span> · connecta una
            API de resultats per al directe. Format oficial FIFA: {TOURNAMENT.teamCount} seleccions.
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground lg:hidden">
        <Wordmark />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Obre el menú"
            data-testid="button-menu-open"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border hover-elevate"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <Wordmark />
              <button
                onClick={() => setOpen(false)}
                aria-label="Tanca el menú"
                data-testid="button-menu-close"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border hover-elevate"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main scroll region */}
      <main
        className="h-[calc(100dvh-57px)] overflow-y-auto lg:h-[100dvh]"
        style={{ overscrollBehavior: "contain" }}
      >
        {children}
      </main>
    </div>
  );
}

// Capçalera de pàgina reutilitzable.
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight" data-testid="text-page-title">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
