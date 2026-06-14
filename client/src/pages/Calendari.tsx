import { useMemo, useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { ProbBar, TeamLabel, TeamFlag, StatusPill, formatDate, MatchBarcelonaTime, LiveStatusChip } from "@/components/bits";
import { Match } from "@/data/mundial";
import { useLiveData } from "@/hooks/useLiveResults";
import { MapPin, Clock, Tv } from "lucide-react";

type Filter = "spain" | "all" | "today" | "upcoming";

// Per a la demo, "avui" és el dia del primer partit d'Espanya.
const TODAY = "2026-06-15";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "spain", label: "Espanya" },
  { id: "all", label: "Tots" },
  { id: "today", label: "Avui" },
  { id: "upcoming", label: "Pròxims" },
];

function MatchRow({ m }: { m: Match }) {
  const spain = m.home === "ESP" || m.away === "ESP";
  return (
    <div
      data-testid={`match-row-${m.id}`}
      className={`rounded-xl border bg-card p-4 transition-colors hover-elevate ${
        spain ? "border-primary/40 ring-1 ring-primary/20" : "border-card-border"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">
            Grup {m.group}
          </span>
          <span>Jornada {m.round}</span>
          {m.official && (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-600 dark:text-amber-400">
              dada FIFA
            </span>
          )}
        </span>
        <StatusPill status={m.status} />
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center justify-end gap-2 text-right">
          <TeamLabel id={m.home} reverse showFlag={false} className="text-sm font-medium" />
          <TeamFlag id={m.home} className="text-2xl" />
        </div>
        <div className="text-center">
          {m.status === "finished" ? (
            <span className="inline-flex flex-col items-center">
              <span className="font-display text-xl font-bold tnum" data-testid={`score-${m.id}`}>
                {m.homeGoals}–{m.awayGoals}
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Final
              </span>
            </span>
          ) : m.status === "live" ? (
            <span className="inline-flex flex-col items-center">
              <span className="font-display text-xl font-bold tnum text-primary" data-testid={`score-${m.id}`}>
                {m.homeGoals ?? 0}–{m.awayGoals ?? 0}
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> En directe
              </span>
            </span>
          ) : (
            <span className="inline-flex flex-col items-center">
              <span className="rounded bg-primary/15 px-2 py-1 text-sm font-bold tnum text-primary">
                <MatchBarcelonaTime match={m} />
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                h. Barcelona
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TeamFlag id={m.away} className="text-2xl" />
          <TeamLabel id={m.away} showFlag={false} className="text-sm font-medium" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> Hora local: {m.time} ({m.city})
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {m.venue}, {m.city}
        </span>
        {m.tv && (
          <span className="flex items-center gap-1" data-testid={`tv-${m.id}`}>
            <Tv className="h-3.5 w-3.5" />
            <span className={spain ? "font-medium text-foreground" : ""}>{m.tv}</span>
          </span>
        )}
      </div>

      {m.status === "upcoming" && (
        <div className="mt-3 border-t border-card-border pt-3">
          <ProbBar home={m.home} away={m.away} />
        </div>
      )}
    </div>
  );
}

export default function Calendari() {
  const [filter, setFilter] = useState<Filter>("spain");
  const { matches, liveAddedCount } = useLiveData();

  const filtered = useMemo(() => {
    let list = [...matches];
    if (filter === "spain") list = list.filter((m) => m.home === "ESP" || m.away === "ESP");
    if (filter === "today") list = list.filter((m) => m.date === TODAY);
    if (filter === "upcoming") list = list.filter((m) => m.status !== "finished");
    return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [filter, matches]);

  // agrupa per data
  const byDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    filtered.forEach((m) => {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        <PageHeader
          title="Calendari del Mundial"
          subtitle="Fase de grups · filtra per Espanya, tots, avui o pròxims partits."
        />

        <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">
            Horaris en hora de Barcelona
          </span>
          <span className="inline-flex items-center gap-1">
            <Tv className="h-3.5 w-3.5" /> TV España · DAZN Mundial (tots) · RTVE en obert (Espanya)
          </span>
          <LiveStatusChip />
          {liveAddedCount > 0 && (
            <span className="rounded bg-chart-3/15 px-2 py-0.5 font-medium text-chart-3" data-testid="espn-complete-note">
              Calendari complet carregat d'ESPN (+{liveAddedCount})
            </span>
          )}
        </p>

        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filtres del calendari">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              data-testid={`filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover-elevate"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {byDate.length === 0 ? (
          <div
            className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground"
            data-testid="empty-calendar"
          >
            No hi ha partits per a aquest filtre.
          </div>
        ) : (
          <div className="space-y-7">
            {byDate.map(([date, matches]) => (
              <div key={date}>
                <h2 className="mb-3 text-sm font-semibold capitalize text-muted-foreground">
                  {formatDate(date)}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {matches.map((m) => (
                    <MatchRow key={m.id} m={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
