import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/queryKeys";
import { getAdminDashboard } from "../api/adminDashboardApi";

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: getAdminDashboard,
  });
}
