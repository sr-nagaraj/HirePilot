import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../services/apiClient";
import { queryKeys } from "../../../services/queryKeys";
import { useToast } from "../../../shared/hooks/useToast";
import { getMyApplications, applyToJob } from "../api/applicationsApi";
import { getJobById, getJobs, getRecruiterJobs } from "../api/jobsApi";

export function useJobsQuery() {
  return useQuery({
    queryKey: queryKeys.jobs.all,
    queryFn: getJobs,
  });
}

export function useJobDetailsQuery(jobId: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId ?? ""),
    queryFn: () => getJobById(jobId ?? ""),
    enabled: Boolean(jobId),
  });
}

export function useRecruiterJobsQuery() {
  return useQuery({
    queryKey: queryKeys.jobs.recruiter,
    queryFn: getRecruiterJobs,
  });
}

export function useMyApplicationsQuery() {
  return useQuery({
    queryKey: queryKeys.applications.my,
    queryFn: getMyApplications,
  });
}

export function useApplyToJobMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ jobId, resumeId }: { jobId: number; resumeId: number }) =>
      applyToJob(jobId, resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.dashboard });
      showToast("Application submitted.", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}
