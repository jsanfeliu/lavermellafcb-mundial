import { ReactNode } from "react";
import { TEAMS, FLAG, TeamId, Match, matchProbability, flagIsGeneric } from "@/data/mundial";

export function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

// Bandera de l'equip. Si l'emoji és genèric (p. ex. Escòcia), mostra el codi
// com a insígnia perquè l'equip sigui identificable a tots els entorns.
export function TeamFlag({ id, className = "" }: { id: TeamId; className?: string }) {
  const t = TEAMS[id];
  const flag = FLAG[t.code];
  if (flagIsGeneric(flag)) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm bg-muted px-1 text-[10px] font-bold leading-none text-muted-foreground ${className}`}
        aria-label={t.name}
      >
        {t.code}
      </span>
    );
  }
  return (
    <span className={className} aria-label={t.name}>
      {flag}
    </span>
  );
}

export function TeamLabel({
  id,
  className = "",
  showFlag = true,
  reverse = false,
}: {
  id: TeamId;
  className?: string;
  showFlag?: boolean;
  reverse?: boolean;
}) {
  const t = TEAMS[id];
  return (
    <span
      className={`inline-flex items-center gap-2 ${reverse ? "flex-row-reverse" : ""} ${
        t.isSpain ? "font-semibold text-primary" : ""
      } ${className}`}
      data-testid={`team-${id}`}
    >
      {showFlag && <TeamFlag id={id} className="text-base leading-none" />}
      <span className="truncate">{t.name}</span>
    </span>
  );
}

export function StatusPill({ status }: { status: Match["status"] }) {
  const map = {
    upcoming: { label: "Pròxim", cls: "bg-secondary text-secondary-foreground" },
    live: { label: "En directe", cls: "bg-primary text-primary-foreground" },
    finished: { label: "Final", cls: "bg-muted text-muted-foreground" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>
      {status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {s.label}
    </span>
  );
}

// Barra de probabilitat V/E/D (win/draw/loss).
export function ProbBar({
  home,
  away,
  className = "",
}: {
  home: TeamId;
  away: TeamId;
  className?: string;
}) {
  const p = matchProbability(home, away);
  const segs = [
    { w: p.win, color: "bg-chart-1", label: "V" },
    { w: p.draw, color: "bg-chart-5", label: "E" },
    { w: p.loss, color: "bg-chart-4", label: "D" },
  ];
  return (
    <div className={className}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted" role="img"
        aria-label={`Victòria ${pct(p.win)}, empat ${pct(p.draw)}, derrota ${pct(p.loss)}`}>
        {segs.map((s, i) => (
          <div
            key={i}
            className={`${s.color} origin-left animate-grow-bar`}
            style={{ width: `${s.w * 100}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] tnum text-muted-foreground">
        <span className="text-chart-1 font-medium">V {pct(p.win)}</span>
        <span>E {pct(p.draw)}</span>
        <span className="text-chart-4">D {pct(p.loss)}</span>
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "primary" | "accent" | "default";
}) {
  const color =
    accent === "primary" ? "text-primary" : accent === "accent" ? "text-amber-500 dark:text-amber-400" : "text-foreground";
  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1.5 font-display text-2xl font-bold tnum animate-count-up ${color}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={`rounded-xl border border-card-border bg-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-card-border px-5 py-3.5">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

// Avís reutilitzable de "mode demo".
export function DemoNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      Les probabilitats són estimacions d'un model de demostració (Poisson sobre força
      d'equip), <span className="font-medium">no quotes d'apostes ni dades oficials</span>.
    </p>
  );
}

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ca-ES", { weekday: "short", day: "numeric", month: "short" });
}
