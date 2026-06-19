import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_STORAGE_KEY } from "../../shared/constants/app";
import type { AuthRole, AuthSession } from "../../shared/types/auth";
import { decodeJwt } from "../../shared/utils/jwt";

interface AuthState {
  token: string | null;
  email: string | null;
  role: AuthRole | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (session: AuthSession, rememberMe?: boolean) => void;
  logout: () => void;
}

const anonymousState = {
  token: null,
  email: null,
  role: null,
  isAuthenticated: false,
  rememberMe: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...anonymousState,
      login: (session, rememberMe = true) =>
        set({
          token: session.token,
          email: session.email,
          role: session.role,
          isAuthenticated: true,
          rememberMe,
        }),
      logout: () => set(anonymousState),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.token) {
          try {
            decodeJwt(state.token);
          } catch {
            state.logout();
          }
        }
      },
      partialize: (state) =>
        state.rememberMe
          ? {
              token: state.token,
              email: state.email,
              role: state.role,
              isAuthenticated: state.isAuthenticated,
              rememberMe: state.rememberMe,
            }
          : anonymousState,
    },
  ),
);
