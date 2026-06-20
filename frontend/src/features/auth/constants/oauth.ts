import { API_BASE_URL } from "../../../shared/constants/app";

const OAUTH_BASE_URL = import.meta.env.DEV
  ? API_BASE_URL
  : (import.meta.env.VITE_OAUTH_BASE_URL?.trim() || window.location.origin);

export const GOOGLE_OAUTH_URL =
  `${OAUTH_BASE_URL}/api/auth/oauth2/authorization/google`;

export const OAUTH_FLOW_STORAGE_KEY = "hirepilot.oauthFlow";

export function startGoogleOAuth() {
  sessionStorage.setItem(OAUTH_FLOW_STORAGE_KEY, "google");
  window.location.href = GOOGLE_OAUTH_URL;
}
