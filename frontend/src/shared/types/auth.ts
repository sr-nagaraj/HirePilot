export const AUTH_ROLES = ["CANDIDATE", "RECRUITER", "ADMIN"] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];

export interface AuthSession {
  token: string;
  email: string;
  role: AuthRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
  role: Exclude<AuthRole, "ADMIN">;
  otp: string;
}

export interface SendOtpResponse {
  message: string;
}
