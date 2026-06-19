import { API_BASE_URL } from "../../../shared/constants/app";

export const GOOGLE_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;

export const OAUTH_FLOW_STORAGE_KEY = "hirepilot.oauthFlow";

export function startGoogleOAuth() {
  sessionStorage.setItem(OAUTH_FLOW_STORAGE_KEY, "google");
  window.location.href = GOOGLE_OAUTH_URL;
}
