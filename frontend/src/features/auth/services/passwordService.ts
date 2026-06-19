import { apiClient } from "../../../services/apiClient";

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export async function sendForgotPasswordOtp(email: string) {
  const { data } = await apiClient.post<string>("/api/auth/forgot-password/send-otp", { email });
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<string>("/api/auth/reset-password", payload);
  return data;
}
