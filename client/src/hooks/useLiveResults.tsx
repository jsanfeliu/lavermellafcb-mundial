import { createContext, useContext, useMemo, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MATCHES,
  Match,
  LiveResults,
  mergeLiveResults,
  spainMatchesFrom,
  SPAIN_MATCHES,
} from "@/data/mundial";

// Descarrega ./results-live.json (generat per scripts/update-live-results.mjs i
// servit estàticament). Cache-busting per evitar dades velles del navegador o
// del service worker. Si falla (offline / fitxer absent), retornem null i el
// frontend fa servir les dades llavor.
async function fetchLiveResults(): Promise<LiveResults | null> {
  const url = new URL("results-live.json", document.baseURI);
  url.searchParams.set("t", String(Date.now()));
  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as LiveResults;
    if (!data || !Array.isArray(data.events)) return null;
    return data;
  } catch {
    return null;
  }
}

export interface LiveDataValue {
  live: LiveResults | null;
  isLive: boolean;          // hi ha dades reals carregades
  isLoading: boolean;
  isRefreshing: boolean;    // refetch manual en curs
  fetchStatus: "success" | "error" | "idle"; // resultat de la darrera petició
  fetchedAt: string | null; // ISO de la darrera actualització d'ESPN
  matches: Match[];         // MATCHES amb resultats reals fusionats + partits ESPN
  spainMatches: Match[];    // partits d'Espanya (fusionats)
  liveAddedCount: number;   // partits afegits des d'ESPN no presents a la llavor
  finishedCount: number;    // partits acabats al conjunt fusionat
  refresh: () => void;      // força una recàrrega (cache-busting)
}

const LiveDataContext = createContext<LiveDataValue | null>(null);

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isFetching, status, refetch } = useQuery({
    queryKey: ["results-live"],
    queryFn: fetchLiveResults,
    // Refresca periòdicament per reflectir partits en directe; sense cache vell.
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
    retry: 1,
  });

  const value = useMemo<LiveDataValue>(() => {
    const live = data ?? null;
    const isLive = !!live && live.events.length > 0;
    const matches = isLive ? mergeLiveResults(live, MATCHES) : MATCHES;
    const spainMatches = isLive ? spainMatchesFrom(matches) : SPAIN_MATCHES;
    const liveAddedCount = matches.filter((m) => m.fromLive).length;
    const finishedCount = matches.filter((m) => m.status === "finished").length;
    // Si la petició ha acabat però no ha retornat dades (offline/fitxer absent),
    // ho tractem com a error de cara a la interfície.
    const fetchStatus: LiveDataValue["fetchStatus"] =
      status === "pending" ? "idle" : status === "error" || (!isLoading && !live) ? "error" : "success";
    return {
      live,
      isLive,
      isLoading,
      isRefreshing: isFetching,
      fetchStatus,
      fetchedAt: live?.fetched_at ?? null,
      matches,
      spainMatches,
      liveAddedCount,
      finishedCount,
      refresh: () => { void refetch(); },
    };
  }, [data, isLoading, isFetching, status, refetch]);

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>;
}

export function useLiveData(): LiveDataValue {
  const ctx = useContext(LiveDataContext);
  if (!ctx) {
    // Fora del provider: comportament segur amb dades llavor.
    return {
      live: null,
      isLive: false,
      isLoading: false,
      isRefreshing: false,
      fetchStatus: "idle",
      fetchedAt: null,
      matches: MATCHES,
      spainMatches: SPAIN_MATCHES,
      liveAddedCount: 0,
      finishedCount: MATCHES.filter((m) => m.status === "finished").length,
      refresh: () => {},
    };
  }
  return ctx;
}
