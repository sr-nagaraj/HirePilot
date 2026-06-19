import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/queryKeys";
import { getProfile } from "../api/profileApi";

export function useProfileQuery(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: getProfile,
    enabled: options.enabled,
  });
}
