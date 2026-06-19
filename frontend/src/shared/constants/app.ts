export const APP_NAME = "HirePilot";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8080";

export const AUTH_STORAGE_KEY = "hirepilot.auth";

export const REMEMBERED_EMAIL_KEY = "hirepilot.rememberedEmail";
