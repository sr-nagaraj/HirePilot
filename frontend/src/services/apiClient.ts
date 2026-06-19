import axios from "axios";
import { useAuthStore } from "../app/store/authStore";
import { API_BASE_URL } from "../shared/constants/app";
import { ROUTES } from "../shared/constants/routes";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          !error.config?.skipAuthRedirect
      ) {
        useAuthStore.getState().logout();

        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.assign(`${ROUTES.LOGIN}?expired=true`);
        }
      }

      return Promise.reject(error);
    },
);

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }

    if (responseData && typeof responseData === "object") {
      const maybeMessage =
          "message" in responseData ? responseData.message : undefined;

      const maybeError =
          "error" in responseData ? responseData.error : undefined;

      if (typeof maybeMessage === "string") {
        return maybeMessage;
      }

      if (typeof maybeError === "string") {
        return maybeError;
      }
    }

    return error.message || "Unable to complete request.";
  }

  return "Unable to complete request.";
}

export function isApiStatus(error: unknown, status: number) {
  return axios.isAxiosError(error) && error.response?.status === status;
}