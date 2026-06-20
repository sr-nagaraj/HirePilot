import { CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { AuthPageShell } from "../components/AuthPageShell";

export function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get("email");

    if (!email) {
      navigate(`${ROUTES.LOGIN}?expired=true`, { replace: true });
      return;
    }

    navigate(`${ROUTES.OAUTH_ROLE_SELECTION}?email=${encodeURIComponent(email)}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <AuthPageShell title="Completing Google sign-in" subtitle="Preparing your HirePilot workspace.">
      <Stack spacing={2.25} alignItems="center">
        <CircularProgress />
        <Typography color="text.secondary">Signing you in...</Typography>
      </Stack>
    </AuthPageShell>
  );
}
