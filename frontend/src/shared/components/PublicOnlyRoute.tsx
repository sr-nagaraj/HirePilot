import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../app/store/authStore";
import { getDashboardPath } from "../utils/getDashboardPath";
import type { ReactNode } from "react";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}
