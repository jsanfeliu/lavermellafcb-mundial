import { Layout, PageHeader } from "@/components/Layout";
import { Card, TeamFlag, DemoNote, LiveStatusChip, pct, formatDate } from "@/components/bits";
import { useOutlook } from "@/hooks/useOutlook";
import { useLiveData } from "@/hooks/useLiveResults";
import {
  matchProbability,
  TOURNAMENT,
  TEAMS,
} from "@/data/mundial";
import { Radio, MapPin, Trophy, Flag } from "lucide-react";

// Etapes del torneig per a la línia de progrés.
const STAGES = [
  { key: "groups", label: "Fase de grups", short: "Grups" },
  { key: "r32", label: "16ens de final", short: "16ens" },
  { key: "r16", label: "Vuitens", short: "Vuitens" },
  { key: "qf", label: "Quarts", short: "Quarts" },
  { key: "sf", label: "Semifinals", short: "Semis" },
  { key: "final", label: "Final", short: "Final" },
];

function ProgressTimeline() {
  // En mode demo, el torneig encara no ha començat: 1a etapa "activa".
  const currentIdx = 0;
  return (
    <div className="flex items-center" data-testid="timeline-stages">
      {STAGES.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : done
                    ? "bg-chart-3 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`whitespace-nowrap text-[11px] ${
                  active ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {s.short}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 rounded ${done ? "bg-chart-3" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Pulse "energy" gauge per a la confiança en la classificació.
function PulseGauge({ value }: { value: number }) {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" aria-hidden />
      <span className="absolute inset-3 rounded-full bg-primary/15 animate-pulse-ring [animation-delay:600ms]" aria-hidden />
      <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-primary bg-card">
        <span className="font-display text-2xl font-bold tnum text-primary">{pct(value)}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">passar</span>
      </div>
    </div>
  );
}

export default function Seguiment() {
  const outlook = useOutlook();
  const { spainMatches: SPAIN_MATCHES } = useLiveData();

  return (
    <Layout>
      <div className="stadium-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <PageHeader
            title="Seguiment visual del Mundial"
            subtitle="El pols del torneig i el camí d'Espanya, d'un cop d'ull."
          />

          <div className="mb-5">
            <LiveStatusChip />
          </div>

          {/* Progrés del torneig */}
          <Card title="Progrés del torneig" className="mb-5">
            <ProgressTimeline />
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Seleccions", v: TOURNAMENT.teamCount },
                { label: "Grups", v: TOURNAMENT.groupCount },
                { label: "Partits totals", v: TOURNAMENT.totalMatches },
                { label: "Ciutats seu", v: TOURNAMENT.hostCities },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="font-display text-xl font-bold tnum">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Pols / energia */}
            <Card title="Pols de LaVermellaFCB" className="lg:col-span-1">
              <div className="flex flex-col items-center gap-4 py-2">
                <PulseGauge value={outlook.pAdvanceByRound[2]} />
                <div className="text-center">
                  <div className="text-sm">
                    Probabilitat de classificar-se a la fase final
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Guanyar el grup: <span className="font-semibold text-amber-500 dark:text-amber-400">{pct(outlook.pWinGroup)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Camí en targetes (bracket cards) */}
            <Card title="El camí d'Espanya" className="lg:col-span-2">
              <ol className="relative space-y-4 border-l-2 border-dashed border-border pl-6" role="list">
                {SPAIN_MATCHES.map((m, i) => {
                  const isHome = m.home === "ESP";
                  const opp = isHome ? m.away : m.home;
                  const p = matchProbability(m.home, m.away);
                  const win = isHome ? p.win : p.loss;
                  return (
                    <li key={m.id} className="relative" data-testid={`tracker-step-${m.id}`}>
                      <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {m.round}
                      </span>
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-card-border bg-background/50 p-3">
                        <div className="flex items-center gap-2">
                          <TeamFlag id={opp} className="text-2xl" />
                          <div>
                            <div className="text-sm font-medium">Espanya vs {TEAMS[opp].name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {m.city} · {formatDate(m.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Victòria</div>
                          <div className="font-display text-lg font-bold tnum text-chart-1">{pct(win)}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
                <li className="relative">
                  <span className="absolute -left-[33px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-amber-950">
                    <Trophy className="h-3.5 w-3.5" />
                  </span>
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                    <span className="font-semibold">Eliminatòries</span> — s'obren si Espanya queda
                    entre els 2 primers. Probabilitat actual:{" "}
                    <span className="font-bold text-amber-600 dark:text-amber-400">{pct(outlook.pAdvanceByRound[2])}</span>.
                  </div>
                </li>
              </ol>
            </Card>
          </div>

          {/* Mapa de seus (venue cards) */}
          <Card title="Seus dels partits d'Espanya" className="mt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {SPAIN_MATCHES.map((m) => (
                <div
                  key={m.id}
                  data-testid={`venue-card-${m.id}`}
                  className="relative overflow-hidden rounded-lg border border-card-border bg-gradient-to-br from-card to-secondary/40 p-4"
                >
                  <div className="pitch-stripes absolute inset-0 opacity-20" aria-hidden />
                  <div className="relative">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Radio className="h-3.5 w-3.5" /> Jornada {m.round}
                    </div>
                    <div className="mt-1 font-display text-base font-bold">{m.venue}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {m.city}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-sm">
                      <Flag className="h-3.5 w-3.5 text-primary" />
                      Espanya vs {TEAMS[m.home === "ESP" ? m.away : m.home].name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DemoNote className="mt-4" />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
