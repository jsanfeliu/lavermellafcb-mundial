import { Layout, PageHeader } from "@/components/Layout";
import { TeamFlag, LiveStatusChip } from "@/components/bits";
import { useLiveData } from "@/hooks/useLiveResults";
import {
  GROUPS,
  computeStandings,
  TEAMS,
  SPAIN_GROUP_ID,
} from "@/data/mundial";

const COLS = [
  { key: "p", label: "PJ", title: "Partits jugats" },
  { key: "w", label: "G", title: "Guanyats" },
  { key: "d", label: "E", title: "Empatats" },
  { key: "l", label: "P", title: "Perduts" },
  { key: "gf", label: "GF", title: "Gols a favor" },
  { key: "ga", label: "GC", title: "Gols en contra" },
  { key: "gd", label: "DG", title: "Diferència de gols" },
  { key: "pts", label: "Pts", title: "Punts" },
] as const;

function GroupCard({ groupId, label }: { groupId: string; label: string }) {
  const { matches } = useLiveData();
  const standings = computeStandings(groupId, matches);
  const isSpainGroup = groupId === SPAIN_GROUP_ID;
  return (
    <section
      data-testid={`group-card-${groupId}`}
      className={`overflow-hidden rounded-xl border bg-card ${
        isSpainGroup ? "border-primary/50 ring-1 ring-primary/30" : "border-card-border"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          isSpainGroup ? "bg-primary/10" : "bg-secondary/40"
        }`}
      >
        <h2 className="font-display text-sm font-bold">{label}</h2>
        {isSpainGroup && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
            🇪🇸 Espanya
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-card-border text-[11px] uppercase text-muted-foreground">
              <th className="py-2 pl-3 pr-1 text-left font-medium">Equip</th>
              {COLS.map((c) => (
                <th key={c.key} className="px-1.5 py-2 text-center font-medium" title={c.title}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => {
              const spain = TEAMS[row.team].isSpain;
              const qualifies = i < 2;
              return (
                <tr
                  key={row.team}
                  data-testid={`standing-row-${row.team}`}
                  className={`border-b border-card-border/60 last:border-0 ${spain ? "bg-primary/5" : ""}`}
                >
                  <td className="py-2 pl-3 pr-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                          qualifies ? "bg-chart-3 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <TeamFlag id={row.team} className="text-base leading-none" />
                      <span className={`truncate ${spain ? "font-semibold text-primary" : ""}`}>
                        {TEAMS[row.team].name}
                      </span>
                    </span>
                  </td>
                  {COLS.map((c) => (
                    <td
                      key={c.key}
                      className={`px-1.5 py-2 text-center tnum ${
                        c.key === "pts" ? "font-semibold" : "text-muted-foreground"
                      } ${c.key === "gd" && row.gd > 0 ? "text-chart-3" : ""}`}
                    >
                      {c.key === "gd" && row.gd > 0 ? `+${row.gd}` : (row as any)[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function Grups() {
  // Posa el grup d'Espanya primer.
  const ordered = [...GROUPS].sort((a, b) =>
    a.id === SPAIN_GROUP_ID ? -1 : b.id === SPAIN_GROUP_ID ? 1 : a.id.localeCompare(b.id)
  );
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <PageHeader
          title="Grups i classificació"
          subtitle="Els 12 grups del Mundial 2026. El grup d'Espanya, destacat i primer."
        />

        <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-chart-3 text-[10px] font-bold text-white">
              1
            </span>
            Posicions de classificació (top 2)
          </span>
          <span>
            La classificació es calcula amb els resultats reals d'ESPN; els partits
            pendents encara no compten.
          </span>
          <LiveStatusChip />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ordered.map((g) => (
            <GroupCard key={g.id} groupId={g.id} label={g.label} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
