import { ROLE_DASHBOARD_ROUTES, ROUTES } from "../constants/routes";
import type { AuthRole } from "../types/auth";

export function getDashboardPath(role: AuthRole | null | undefined) {
  return role ? ROLE_DASHBOARD_ROUTES[role] : ROUTES.LOGIN;
}
