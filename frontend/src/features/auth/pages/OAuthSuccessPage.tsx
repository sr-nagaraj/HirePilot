import { CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { AuthPageShell } from "../components/AuthPageShell";
import { useAuthStore } from "../../../app/store/authStore";
import { decodeJwt } from "../../../shared/utils/jwt";
import { getDashboardPath } from "../../../shared/utils/getDashboardPath";

export function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const email = searchParams.get("email");

    if (token && role) {
      try {
        const decoded = decodeJwt(token);
        login(
          {
            token,
            email: decoded.email,
            role: decoded.role,
          },
          true,
        );
        navigate(getDashboardPath(decoded.role), { replace: true });
        return;
      } catch (error) {
        console.error("OAuth token processing error:", error);
        navigate(`${ROUTES.LOGIN}?expired=true`, { replace: true });
        return;
      }
    }

    if (email) {
      navigate(`${ROUTES.OAUTH_ROLE_SELECTION}?email=${encodeURIComponent(email)}`, { replace: true });
      return;
    }

    navigate(`${ROUTES.LOGIN}?expired=true`, { replace: true });
  }, [navigate, searchParams, login]);

  return (
    <AuthPageShell title="Completing Google sign-in" subtitle="Preparing your HirePilot workspace.">
      <Stack spacing={2.25} alignItems="center">
        <CircularProgress />
        <Typography color="text.secondary">Signing you in...</Typography>
      </Stack>
    </AuthPageShell>
  );
}
