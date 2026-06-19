import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/queryKeys";
import { getApplicantDetails } from "../api/applicantApi";

export function useApplicantDetailsQuery(jobId: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.jobs.applicantDetails(jobId ?? ""),
    queryFn: () => getApplicantDetails(Number(jobId)),
    enabled: Boolean(jobId),
    staleTime: 30_000,
  });
}
