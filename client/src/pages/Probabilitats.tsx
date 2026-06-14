import { Layout, PageHeader } from "@/components/Layout";
import { Card, TeamLabel, DemoNote, pct, formatDate } from "@/components/bits";
import { useOutlook } from "@/hooks/useOutlook";
import {
  SPAIN_MATCHES,
  matchProbability,
  TEAMS,
  FLAG,
} from "@/data/mundial";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Info } from "lucide-react";

export default function Probabilitats() {
  const outlook = useOutlook();

  const matchData = SPAIN_MATCHES.map((m) => {
    const isHome = m.home === "ESP";
    const opp = isHome ? m.away : m.home;
    const p = matchProbability(m.home, m.away);
    return {
      m,
      opp,
      win: isHome ? p.win : p.loss,
      draw: p.draw,
      loss: isHome ? p.loss : p.win,
      xp: isHome ? p.expectedPoints : p.loss * 3 + p.draw,
    };
  });

  const totalXp = matchData.reduce((a, b) => a + b.xp, 0);

  const firstByRoundData = outlook.pFirstByRound.map((v, i) => ({
    round: `J${i + 1}`,
    pct: Math.round(v * 100),
    advance: Math.round(outlook.pAdvanceByRound[i] * 100),
  }));

  const finishData = [
    { pos: "1r", v: Math.round(outlook.finishDist.first * 100), color: "hsl(var(--chart-2))" },
    { pos: "2n", v: Math.round(outlook.finishDist.second * 100), color: "hsl(var(--chart-1))" },
    { pos: "3r", v: Math.round(outlook.finishDist.third * 100), color: "hsl(var(--chart-5))" },
    { pos: "4t", v: Math.round(outlook.finishDist.fourth * 100), color: "hsl(var(--chart-4))" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        <PageHeader
          title="Probabilitats d'Espanya"
          subtitle="Estimacions partit a partit i posició final al grup."
        />

        {/* Avís model */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm">
            <span className="font-semibold">Estimacions d'un model de demostració.</span> Es
            calculen amb una distribució de Poisson sobre la força relativa dels equips i una
            simulació Monte Carlo del grup.{" "}
            <span className="font-medium">No són quotes d'apostes ni prediccions oficials.</span>
          </div>
        </div>

        {/* Probabilitat per partit */}
        <div className="grid gap-4 lg:grid-cols-3">
          {matchData.map(({ m, opp, win, draw, loss, xp }) => (
            <Card key={m.id} title={<span>Jornada {m.round}</span>}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{FLAG[TEAMS[opp].code]}</span>
                <div>
                  <div className="text-sm">
                    Espanya vs <TeamLabel id={opp} showFlag={false} className="font-medium" />
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(m.date)} · {m.time}</div>
                </div>
              </div>

              {[
                { label: "Victòria", v: win, cls: "bg-chart-1", t: "text-chart-1" },
                { label: "Empat", v: draw, cls: "bg-chart-5", t: "text-foreground" },
                { label: "Derrota", v: loss, cls: "bg-chart-4", t: "text-chart-4" },
              ].map((row) => (
                <div key={row.label} className="mb-2">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={`tnum font-semibold ${row.t}`}>{pct(row.v)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full origin-left animate-grow-bar rounded-full ${row.cls}`}
                      style={{ width: `${row.v * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-3 flex items-center justify-between border-t border-card-border pt-3 text-sm">
                <span className="text-muted-foreground">Punts esperats</span>
                <span className="tnum font-display text-lg font-bold text-primary" data-testid={`xp-${m.id}`}>
                  {xp.toFixed(2)}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Gràfics */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card title="Probabilitat de ser 1r del grup, ronda a ronda">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={firstByRoundData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="round" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--popover-border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number, n) => [`${v}%`, n === "pct" ? "1r del grup" : "Passar (top 2)"]}
                  />
                  <Line type="monotone" dataKey="advance" stroke="hsl(var(--chart-3))" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pct" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-3" /> Passar de ronda (top 2)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" /> Acabar 1r
              </span>
            </div>
          </Card>

          <Card title="Distribució de la posició final al grup">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={finishData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="pos" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} unit="%" />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--popover-border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}%`, "Probabilitat"]}
                  />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                    {finishData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Què vol dir */}
        <Card title="Què vol dir?" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="font-display text-2xl font-bold tnum text-primary">{totalXp.toFixed(1)}</div>
              <div className="text-sm font-medium">punts esperats al grup</div>
              <p className="mt-1 text-xs text-muted-foreground">
                De 9 possibles. Sovint amb 7+ punts s'acaba 1r de grup.
              </p>
            </div>
            <div>
              <div className="font-display text-2xl font-bold tnum text-amber-500 dark:text-amber-400">
                {pct(outlook.pWinGroup)}
              </div>
              <div className="text-sm font-medium">guanyar el grup</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Ser 1r facilita un encreuament teòricament més assequible a eliminatòries.
              </p>
            </div>
            <div>
              <div className="font-display text-2xl font-bold tnum text-chart-3">
                {pct(outlook.pAdvanceByRound[2])}
              </div>
              <div className="text-sm font-medium">classificar-se</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Acabar entre els 2 primers del grup en finalitzar la fase.
              </p>
            </div>
          </div>
          <DemoNote className="mt-4" />
        </Card>
      </div>
    </Layout>
  );
}
