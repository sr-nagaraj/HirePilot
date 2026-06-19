import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../services/apiClient";
import { queryKeys } from "../../../services/queryKeys";
import { useToast } from "../../../shared/hooks/useToast";
import {
  createRecruiterJob,
  deleteRecruiterJob,
  getApplicationsForJob,
  getRecruiterJobById,
  getRecruiterJobs,
  updateApplicationStatus,
  updateRecruiterJob,
} from "../api/recruiterDashboardApi";
import type {
  JobApplication,
  RecruiterApplicationStatus,
  RecruiterJob,
  RecruiterJobPayload,
} from "../types/recruiterDashboard";
import type { ApplicantDetails } from "../types/applicantTypes";
import type { Job } from "../../jobs/types/jobs";

function invalidateRecruiterDashboard(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.dashboard });
  queryClient.invalidateQueries({ queryKey: queryKeys.jobs.recruiter });
}

export function useRecruiterJobsQuery() {
  return useQuery({
    queryKey: queryKeys.jobs.recruiter,
    queryFn: getRecruiterJobs,
  });
}

export function useRecruiterJobQuery(jobId: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId ?? ""),
    queryFn: () => getRecruiterJobById(jobId ?? ""),
    enabled: Boolean(jobId),
  });
}

export function useRecruiterJobApplicationsQuery(jobId: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.jobs.applications(jobId ?? ""),
    queryFn: () => getApplicationsForJob(Number(jobId)),
    enabled: Boolean(jobId),
  });
}

export function useCreateRecruiterJobMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createRecruiterJob,
    onSuccess: () => {
      invalidateRecruiterDashboard(queryClient);
      showToast("Job created successfully.", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}

export function useUpdateRecruiterJobMutation(jobId: number | string | undefined) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: RecruiterJobPayload) => updateRecruiterJob(jobId ?? "", payload),
    onSuccess: (job) => {
      queryClient.setQueryData(queryKeys.jobs.detail(job.id), job);
      invalidateRecruiterDashboard(queryClient);
      showToast("Job updated successfully.", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}

export function useDeleteRecruiterJobMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteRecruiterJob,
    onMutate: async (jobId) => {
      const recruiterKey = queryKeys.jobs.recruiter;
      const allJobsKey = queryKeys.jobs.all;

      await queryClient.cancelQueries({ queryKey: recruiterKey });
      await queryClient.cancelQueries({ queryKey: allJobsKey });

      const previousJobs = queryClient.getQueryData<RecruiterJob[]>(recruiterKey);
      const previousAllJobs = queryClient.getQueryData<Job[]>(allJobsKey);

      queryClient.setQueryData<RecruiterJob[]>(recruiterKey, (current = []) =>
        current.filter((job) => job.id !== Number(jobId)),
      );

      queryClient.setQueryData<Job[]>(allJobsKey, (current = []) =>
        current.filter((job) => job.id !== Number(jobId)),
      );

      return { previousJobs, previousAllJobs, recruiterKey, allJobsKey };
    },
    onError: (error, _jobId, context) => {
      if (context) {
        queryClient.setQueryData(context.recruiterKey, context.previousJobs);
        queryClient.setQueryData(context.allJobsKey, context.previousAllJobs);
      }
      showToast(getApiErrorMessage(error), "error");
    },
    onSuccess: () => {
      showToast("Job deleted successfully.", "success");
    },
    onSettled: (_data, _error, jobId) => {
      invalidateRecruiterDashboard(queryClient);
      
      // Invalidate candidate and general query caches
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      
      // Remove detail query cache for the deleted job
      if (jobId) {
        queryClient.removeQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      }
    },
  });
}

export function useUpdateApplicationStatusMutation(jobId: number | string | undefined) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: RecruiterApplicationStatus }) =>
      updateApplicationStatus(applicationId, status),
    onMutate: async ({ applicationId, status }) => {
      const applicationsKey = queryKeys.jobs.applications(jobId ?? "");
      const detailsKey = queryKeys.jobs.applicantDetails(jobId ?? "");

      await queryClient.cancelQueries({ queryKey: applicationsKey });
      await queryClient.cancelQueries({ queryKey: detailsKey });

      const previousApplications = queryClient.getQueryData<JobApplication[]>(applicationsKey);
      const previousDetails = queryClient.getQueryData<ApplicantDetails[]>(detailsKey);

      queryClient.setQueryData<JobApplication[]>(applicationsKey, (current = []) =>
        current.map((application) =>
          application.id === applicationId ? { ...application, status } : application,
        ),
      );

      queryClient.setQueryData<ApplicantDetails[]>(detailsKey, (current = []) =>
        current.map((detail) =>
          detail.applicationId === applicationId ? { ...detail, applicationStatus: status } : detail,
        ),
      );

      return { applicationsKey, detailsKey, previousApplications, previousDetails };
    },
    onError: (error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(context.applicationsKey, context.previousApplications);
        queryClient.setQueryData(context.detailsKey, context.previousDetails);
      }

      showToast(getApiErrorMessage(error), "error");
    },
    onSuccess: () => {
      showToast("Application status updated.", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications(jobId ?? "") });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applicantDetails(jobId ?? "") });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.dashboard });
    },
  });
}
