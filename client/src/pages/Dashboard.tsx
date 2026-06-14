import { Link } from "wouter";
import { Layout, PageHeader } from "@/components/Layout";
import { Card, Stat, ProbBar, TeamLabel, TeamFlag, StatusPill, DemoNote, pct, formatDate } from "@/components/bits";
import { useOutlook } from "@/hooks/useOutlook";
import {
  SPAIN_MATCHES,
  SPAIN_GROUP_ID,
  computeStandings,
  matchProbability,
  teamsOfGroup,
  TOURNAMENT,
  TEAMS,
} from "@/data/mundial";
import { ArrowRight, MapPin, Clock, Flag, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const outlook = useOutlook();
  const next = SPAIN_MATCHES.find((m) => m.status !== "finished") ?? SPAIN_MATCHES[0];
  const nextProb = matchProbability(next.home, next.away);
  const spainFirstId = next.home === "ESP" ? next.home : next.away;
  const standings = computeStandings(SPAIN_GROUP_ID);
  const groupTeams = teamsOfGroup(SPAIN_GROUP_ID);

  return (
    <Layout>
      <div className="stadium-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          {/* HERO */}
          <div className="mb-7 overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-[hsl(215_45%_13%)] to-[hsl(351_55%_22%)] text-white shadow-lg">
            <div className="relative px-6 py-7 sm:px-8 sm:py-9">
              <div className="pitch-stripes absolute inset-0 opacity-40" aria-hidden />
              <div className="relative">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  <Flag className="h-3.5 w-3.5 text-amber-300" />
                  {TOURNAMENT.hosts} · {formatDate(TOURNAMENT.start)} – {formatDate(TOURNAMENT.end)} 2026
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  El camí d'<span className="text-amber-300">Espanya</span> cap a la final
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/80">
                  {TOURNAMENT.teamCount} seleccions · {TOURNAMENT.groupCount} grups · final el{" "}
                  {formatDate(TOURNAMENT.finalDate)} a {TOURNAMENT.finalVenue}.
                </p>
                <div className="mt-5 flex flex-wrap gap-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Guanyar el grup</div>
                    <div className="font-display text-3xl font-bold tnum text-amber-300" data-testid="stat-win-group">
                      {pct(outlook.pWinGroup)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Passar de ronda</div>
                    <div className="font-display text-3xl font-bold tnum text-white" data-testid="stat-advance">
                      {pct(outlook.pAdvanceByRound[2])}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Punts esperats</div>
                    <div className="font-display text-3xl font-bold tnum text-white" data-testid="stat-exp-points">
                      {outlook.expGroupPoints.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID PRINCIPAL */}
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Pròxim partit */}
            <Card title="Pròxim partit d'Espanya" className="lg:col-span-2">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <TeamFlag id={next.home} className="text-3xl" />
                    <TeamLabel id={next.home} showFlag={false} className="mt-1 text-sm" />
                  </div>
                  <div className="px-2 text-center">
                    <div className="text-xs font-medium text-muted-foreground">Jornada {next.round}</div>
                    <div className="font-display text-lg font-bold text-muted-foreground">vs</div>
                  </div>
                  <div className="text-center">
                    <TeamFlag id={next.away} className="text-3xl" />
                    <TeamLabel id={next.away} showFlag={false} className="mt-1 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <Clock className="h-4 w-4" /> {formatDate(next.date)} · {next.time}
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <MapPin className="h-4 w-4" /> {next.venue}, {next.city}
                  </div>
                  <StatusPill status={next.status} />
                </div>
              </div>
              <div className="mt-5 border-t border-card-border pt-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" /> Probabilitat estimada del resultat
                </div>
                <ProbBar home={next.home} away={next.away} />
                <p className="mt-3 text-sm">
                  El model dóna a Espanya un <span className="font-semibold text-chart-1">{pct(spainFirstId === next.home ? nextProb.win : nextProb.loss)}</span> de
                  guanyar i un <span className="font-medium">{(spainFirstId === next.home ? nextProb.expectedPoints : (nextProb.loss*3+nextProb.draw)).toFixed(2)}</span> de
                  punts esperats en aquest partit.
                </p>
              </div>
            </Card>

            {/* Estat del grup */}
            <Card title={`Estat del ${SPAIN_GROUP_ID === "E" ? "Grup E" : SPAIN_GROUP_ID}`}>
              <ul className="space-y-2" role="list">
                {standings.map((row, i) => (
                  <li
                    key={row.team}
                    data-testid={`mini-standing-${row.team}`}
                    className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm ${
                      TEAMS[row.team].isSpain ? "bg-primary/10 ring-1 ring-primary/30" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-4 text-center text-xs tnum text-muted-foreground">{i + 1}</span>
                      <TeamLabel id={row.team} />
                    </span>
                    <span className="tnum text-xs text-muted-foreground">
                      {row.p} PJ · <span className="font-semibold text-foreground">{row.pts} pts</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Sense partits jugats encara: la classificació arrenca a 0. Editable al codi.
              </p>
              <Link
                href="/grups"
                data-testid="link-veure-grups"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Veure tots els grups <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </div>

          {/* CAMÍ PROBABLE */}
          <Card title="Camí probable d'Espanya a la fase de grups" className="mt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {SPAIN_MATCHES.map((m, i) => {
                const isHome = m.home === "ESP";
                const opp = isHome ? m.away : m.home;
                const prob = matchProbability(m.home, m.away);
                const pWin = isHome ? prob.win : prob.loss;
                const pLoss = isHome ? prob.loss : prob.win;
                return (
                  <div
                    key={m.id}
                    data-testid={`path-card-${m.id}`}
                    className="relative rounded-lg border border-card-border bg-background/40 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Jornada {m.round}</span>
                      <span className="text-xs tnum text-muted-foreground">{formatDate(m.date)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">ES</span>
                      <span className="text-muted-foreground">vs</span>
                      <TeamFlag id={opp} className="text-xl" />
                      <span className="text-sm">
                        <TeamLabel id={opp} showFlag={false} className="font-medium" />
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
                      <div className="rounded bg-chart-1/15 py-1 tnum">
                        <div className="font-semibold text-chart-1">{pct(pWin)}</div>V
                      </div>
                      <div className="rounded bg-chart-5/15 py-1 tnum">
                        <div className="font-semibold">{pct(prob.draw)}</div>E
                      </div>
                      <div className="rounded bg-chart-4/15 py-1 tnum">
                        <div className="font-semibold text-chart-4">{pct(pLoss)}</div>D
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-card-border pt-2 text-xs">
                      <span className="text-muted-foreground">1r del grup després de J{m.round}</span>
                      <span className="tnum font-semibold text-amber-500 dark:text-amber-400">
                        {pct(outlook.pFirstByRound[i])}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <DemoNote className="mt-4" />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
