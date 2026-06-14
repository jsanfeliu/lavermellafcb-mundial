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
  fetchedAt: string | null; // ISO de la darrera actualització d'ESPN
  matches: Match[];         // MATCHES amb resultats reals fusionats
  spainMatches: Match[];    // partits d'Espanya (fusionats)
}

const LiveDataContext = createContext<LiveDataValue | null>(null);

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
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
    return {
      live,
      isLive,
      isLoading,
      fetchedAt: live?.fetched_at ?? null,
      matches,
      spainMatches,
    };
  }, [data, isLoading]);

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
      fetchedAt: null,
      matches: MATCHES,
      spainMatches: SPAIN_MATCHES,
    };
  }
  return ctx;
}
