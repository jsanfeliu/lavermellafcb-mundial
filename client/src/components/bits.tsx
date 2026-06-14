import { ReactNode } from "react";
import { TEAMS, FLAG, TeamId, Match, matchProbability, flagIsGeneric } from "@/data/mundial";
import { useLiveData } from "@/hooks/useLiveResults";
import { Wifi, WifiOff } from "lucide-react";

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

// Xip d'estat de les dades: en viu (ESPN) o mode llavor (sense connexió).
export function LiveStatusChip({ className = "" }: { className?: string }) {
  const { isLive, isLoading, fetchedAt } = useLiveData();
  const hhmm = fetchedAt
    ? new Intl.DateTimeFormat("ca-ES", {
        timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false,
      }).format(new Date(fetchedAt))
    : null;

  if (isLive) {
    return (
      <span
        data-testid="live-status-chip"
        className={`inline-flex items-center gap-1.5 rounded-full bg-chart-3/15 px-2.5 py-1 text-[11px] font-medium text-chart-3 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-chart-3 animate-pulse" />
        Dades en viu · ESPN{hhmm ? ` · actualitzat ${hhmm}` : ""}
      </span>
    );
  }
  return (
    <span
      data-testid="live-status-chip"
      className={`inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground ${className}`}
    >
      {isLoading ? <Wifi className="h-3 w-3 animate-pulse" /> : <WifiOff className="h-3 w-3" />}
      {isLoading ? "Carregant resultats…" : "Sense connexió · mode llavor"}
    </span>
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

// ---------------------------------------------------------------------
//  Hora de Barcelona (Europe/Madrid) a partir de l'hora local de la seu.
//  Les dades guarden la data/hora en hora LOCAL de la seu + zona horària
//  IANA (`tz`). Convertim a l'instant UTC i el reformatem a Barcelona.
// ---------------------------------------------------------------------
const BCN_TZ = "Europe/Madrid";

// Desplaçament (ms) d'una zona horària respecte a UTC per a un instant donat.
function tzOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const p: Record<string, number> = {};
  for (const { type, value } of dtf.formatToParts(date)) {
    if (type !== "literal") p[type] = Number(value);
  }
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour === 24 ? 0 : p.hour, p.minute, p.second);
  return asUTC - date.getTime();
}

// Instant UTC d'una data/hora local ("2026-06-15", "12:00") en una zona `tz`.
function instantFromLocal(dateIso: string, time: string, tz: string): Date {
  const [h, m] = time.split(":").map(Number);
  const naiveUTC = new Date(`${dateIso}T${time.length === 5 ? time : "00:00"}:00Z`);
  naiveUTC.setUTCHours(h, m, 0, 0);
  // Resta el desplaçament de la seu per obtenir l'instant UTC real.
  const offset = tzOffsetMs(naiveUTC, tz);
  return new Date(naiveUTC.getTime() - offset);
}

export interface BarcelonaTime {
  time: string;       // "18:00"
  dateLabel: string;  // "dl. 15 juny"
  nextDay: boolean;   // cau de matinada del dia següent respecte a la seu
}

// Converteix l'hora local de la seu a hora de Barcelona.
export function toBarcelona(dateIso: string, time: string, tz: string): BarcelonaTime {
  const instant = instantFromLocal(dateIso, time, tz);
  const timeStr = new Intl.DateTimeFormat("ca-ES", {
    timeZone: BCN_TZ, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(instant);
  const dateLabel = new Intl.DateTimeFormat("ca-ES", {
    timeZone: BCN_TZ, weekday: "short", day: "numeric", month: "short",
  }).format(instant);
  // Dia (a Barcelona) vs dia de la seu, per detectar canvi de jornada.
  const bcnDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: BCN_TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(instant);
  const nextDay = bcnDay > dateIso;
  return { time: timeStr, dateLabel, nextDay };
}

// Etiqueta compacta d'hora de Barcelona per a una fila de partit.
export function MatchBarcelonaTime({ match, className = "" }: { match: Match; className?: string }) {
  const b = toBarcelona(match.date, match.time, match.tz);
  return (
    <span className={`tnum ${className}`}>
      {b.time}
      {b.nextDay && <sup className="ml-0.5 text-[9px] font-semibold text-amber-500 dark:text-amber-400">+1 dia</sup>}
    </span>
  );
}
