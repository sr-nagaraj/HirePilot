import { apiClient } from "../../../services/apiClient";
import type { AuthSession } from "../../../shared/types/auth";

export type OAuthSelectableRole = "CANDIDATE" | "RECRUITER";

interface CompleteOAuthRequest {
  email: string;
  fullName: string;
  role: OAuthSelectableRole;
}

export async function completeOAuth(email: string, fullName: string, role: OAuthSelectableRole) {
  const { data } = await apiClient.post<AuthSession, { data: AuthSession }, CompleteOAuthRequest>(
    "/api/auth/oauth/complete",
    {
      email,
      fullName,
      role,
    },
  );

  return data;
}
