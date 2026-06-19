import { apiClient } from "../../../services/apiClient";
import type { AuthSession, LoginRequest, RegisterRequest, SendOtpResponse } from "../../../shared/types/auth";

export async function loginUser(payload: LoginRequest) {
  const { data } = await apiClient.post<AuthSession>("/api/auth/login", payload);
  return data;
}

export async function registerUser(payload: RegisterRequest) {
  const { data } = await apiClient.post<AuthSession>("/api/auth/register", payload);
  return data;
}

export async function sendOtp(email: string) {
  const { data } = await apiClient.post<SendOtpResponse>("/api/auth/send-otp", { email });
  return data;
}
