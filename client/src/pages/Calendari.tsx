import { useMemo, useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { ProbBar, TeamLabel, StatusPill, formatDate } from "@/components/bits";
import { MATCHES, TEAMS, FLAG, Match } from "@/data/mundial";
import { MapPin, Clock } from "lucide-react";

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
          <span className="text-2xl">{FLAG[TEAMS[m.home].code]}</span>
        </div>
        <div className="text-center">
          {m.status === "finished" ? (
            <span className="font-display text-lg font-bold tnum">
              {m.homeGoals}–{m.awayGoals}
            </span>
          ) : (
            <span className="rounded bg-secondary px-2 py-1 text-xs font-semibold tnum text-secondary-foreground">
              {m.time}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{FLAG[TEAMS[m.away].code]}</span>
          <TeamLabel id={m.away} showFlag={false} className="text-sm font-medium" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {formatDate(m.date)} · {m.time}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {m.venue}, {m.city}
        </span>
      </div>

      {m.status !== "finished" && (
        <div className="mt-3 border-t border-card-border pt-3">
          <ProbBar home={m.home} away={m.away} />
        </div>
      )}
    </div>
  );
}

export default function Calendari() {
  const [filter, setFilter] = useState<Filter>("spain");

  const filtered = useMemo(() => {
    let list = [...MATCHES];
    if (filter === "spain") list = list.filter((m) => m.home === "ESP" || m.away === "ESP");
    if (filter === "today") list = list.filter((m) => m.date === TODAY);
    if (filter === "upcoming") list = list.filter((m) => m.status !== "finished");
    return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [filter]);

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
