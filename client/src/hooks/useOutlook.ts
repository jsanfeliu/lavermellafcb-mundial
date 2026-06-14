import { useMemo } from "react";
import { groupOutlook, SPAIN_GROUP_ID, TeamId } from "@/data/mundial";

// Memoitza la simulació Monte Carlo perquè no es recalculi a cada render.
export function useOutlook(groupId: string = SPAIN_GROUP_ID, focusId: TeamId = "ESP") {
  return useMemo(() => groupOutlook(groupId, focusId), [groupId, focusId]);
}
