import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/queryKeys";
import { getCandidateDashboard } from "../api/candidateDashboardApi";

export function useCandidateDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.candidate.dashboard,
    queryFn: getCandidateDashboard,
  });
}
