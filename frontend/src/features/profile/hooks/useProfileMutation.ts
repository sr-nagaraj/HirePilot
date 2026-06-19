import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../services/apiClient";
import { queryKeys } from "../../../services/queryKeys";
import { useToast } from "../../../shared/hooks/useToast";
import { updateProfile, uploadProfilePicture } from "../api/profileApi";
import type { Profile, UpdateProfilePayload } from "../types/profile";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (payload: UpdateProfilePayload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.me });
      const previous = queryClient.getQueryData<Profile | null>(queryKeys.profile.me);
      queryClient.setQueryData<Profile | null>(queryKeys.profile.me, {
        ...(previous ?? {}),
        ...payload,
      });
      return { previous };
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile.me, profile);
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.dashboard });
      showToast("Profile saved successfully.", "success");
    },
    onError: (error, _payload, context) => {
      queryClient.setQueryData(queryKeys.profile.me, context?.previous ?? null);
      showToast(getApiErrorMessage(error), "error");
    },
  });
}

export function useUploadProfilePicture() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: uploadProfilePicture,
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}
