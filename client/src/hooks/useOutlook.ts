import { useMemo } from "react";
import { groupOutlook, SPAIN_GROUP_ID, TeamId } from "@/data/mundial";
import { useLiveData } from "@/hooks/useLiveResults";

// Memoitza la simulació Monte Carlo perquè no es recalculi a cada render.
// Usa els partits fusionats amb resultats reals (congela els ja jugats).
export function useOutlook(groupId: string = SPAIN_GROUP_ID, focusId: TeamId = "ESP") {
  const { matches } = useLiveData();
  return useMemo(
    () => groupOutlook(groupId, focusId, 4000, matches),
    [groupId, focusId, matches],
  );
}
