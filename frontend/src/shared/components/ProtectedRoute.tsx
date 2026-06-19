import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../app/store/authStore";
import { ROUTES } from "../constants/routes";
import type { AuthRole } from "../types/auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  allowedRoles?: AuthRole[];
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}
