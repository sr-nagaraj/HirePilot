import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/store/authStore";
import { getApiErrorMessage } from "../../../services/apiClient";
import { REMEMBERED_EMAIL_KEY } from "../../../shared/constants/app";
import { useToast } from "../../../shared/hooks/useToast";
import { getDashboardPath } from "../../../shared/utils/getDashboardPath";
import { loginUser, registerUser } from "../api/authApi";
import type { LoginFormValues, RegisterWithOtpFormValues } from "../schemas/authSchemas";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const session = await loginUser({
        email: values.email,
        password: values.password,
      });

      return { session, rememberMe: values.rememberMe };
    },
    onSuccess: ({ session, rememberMe }) => {
      login(session, rememberMe);

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, session.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      showToast("Welcome back to HirePilot.", "success");

      const state = location.state as LocationState | null;
      const from = state?.from?.pathname;
      navigate(from || getDashboardPath(session.role), { replace: true });
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error), "error");
    },
  });
}
export function useRegisterMutation() {

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();

  return useMutation({

    mutationFn: async (
        values: RegisterWithOtpFormValues
    ) => {

      return registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
        otp: values.otp,
      });
    },

    onSuccess: (session) => {

      login(
          {
            token: session.token,
            email: session.email,
            role: session.role,
          },
          true
      );

      showToast("Account verified. Welcome to HirePilot.", "success");

      navigate(getDashboardPath(session.role), {
        replace: true,
      });
    },

    onError: (error) => {

      showToast(
          getApiErrorMessage(error),
          "error"
      );
    },
  });
}
