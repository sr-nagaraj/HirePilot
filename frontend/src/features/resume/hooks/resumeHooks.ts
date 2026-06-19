import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../services/apiClient";
import { queryKeys } from "../../../services/queryKeys";
import { useToast } from "../../../shared/hooks/useToast";
import { deleteResume, getResumes, replaceResume, uploadResume } from "../api/resumeApi";
import type { ResumeUploadOptions } from "../types/resume";

export function useResumesQuery() {
  return useQuery({
    queryKey: queryKeys.resumes.list,
    queryFn: getResumes,
  });
}

export function useResumeUploadMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.dashboard });
      showToast("Resume uploaded successfully.", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}

export function useDeleteResumeMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.dashboard });
      showToast("Resume deleted.", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}

export function useReplaceResumeMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ resumeId, options }: { resumeId: number; options: ResumeUploadOptions }) =>
      replaceResume(resumeId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list });
      showToast("Resume replaced successfully.", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}
