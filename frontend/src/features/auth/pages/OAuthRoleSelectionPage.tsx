import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkIcon from "@mui/icons-material/Work";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../app/store/authStore";
import { getApiErrorMessage } from "../../../services/apiClient";
import { ROUTES } from "../../../shared/constants/routes";
import { getDashboardPath } from "../../../shared/utils/getDashboardPath";
import { AuthPageShell } from "../components/AuthPageShell";
import { completeOAuth, type OAuthSelectableRole } from "../api/oauthApi";
import { OAUTH_FLOW_STORAGE_KEY } from "../constants/oauth";

interface OAuthRoleOption {
  value: OAuthSelectableRole;
  title: string;
  description: string;
  icon: ReactElement;
  features: string[];
}

const roleOptions: OAuthRoleOption[] = [
  {
    value: "CANDIDATE",
    title: "Candidate",
    description: "Find jobs and manage your career workspace.",
    icon: <BadgeIcon />,
    features: ["Find jobs", "Build resume", "Track applications"],
  },
  {
    value: "RECRUITER",
    title: "Recruiter",
    description: "Create roles and manage hiring pipelines.",
    icon: <WorkIcon />,
    features: ["Post jobs", "Review candidates", "Manage hiring"],
  },
];

const OAUTH_ROLE_STORAGE_KEY = "hirepilot.oauthRoles";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isOAuthSelectableRole(value: unknown): value is OAuthSelectableRole {
  return value === "CANDIDATE" || value === "RECRUITER";
}

function getStoredOAuthRole(email: string): OAuthSelectableRole | null {
  try {
    const storedRoles = JSON.parse(localStorage.getItem(OAUTH_ROLE_STORAGE_KEY) ?? "{}") as Record<
      string,
      unknown
    >;
    const role = storedRoles[normalizeEmail(email)];

    return isOAuthSelectableRole(role) ? role : null;
  } catch {
    return null;
  }
}

function storeOAuthRole(email: string, role: OAuthSelectableRole) {
  try {
    const storedRoles = JSON.parse(localStorage.getItem(OAUTH_ROLE_STORAGE_KEY) ?? "{}") as Record<
      string,
      OAuthSelectableRole
    >;

    localStorage.setItem(
      OAUTH_ROLE_STORAGE_KEY,
      JSON.stringify({
        ...storedRoles,
        [normalizeEmail(email)]: role,
      }),
    );
  } catch {
    localStorage.setItem(
      OAUTH_ROLE_STORAGE_KEY,
      JSON.stringify({
        [normalizeEmail(email)]: role,
      }),
    );
  }
}

export function OAuthRoleSelectionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<OAuthSelectableRole | null>(null);
  const autoCompleteAttemptedRef = useRef(false);
  const email = searchParams.get("email");
  const name = searchParams.get("name") ?? "";

  const mutation = useMutation({
    mutationFn: (role: OAuthSelectableRole) => completeOAuth(email ?? "", name, role),
    onSuccess: (session) => {
      if (isOAuthSelectableRole(session.role)) {
        storeOAuthRole(session.email, session.role);
      }

      login(
        {
          token: session.token,
          email: session.email,
          role: session.role,
        },
        true,
      );
      sessionStorage.removeItem(OAUTH_FLOW_STORAGE_KEY);
      navigate(getDashboardPath(session.role), { replace: true });
    },
  });

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email || autoCompleteAttemptedRef.current || mutation.isPending || mutation.isSuccess) {
      return;
    }

    const role = getStoredOAuthRole(email);

    if (role) {
      autoCompleteAttemptedRef.current = true;
      mutation.mutate(role);
    }
  }, [email, mutation]);

  const isPending = mutation.isPending;

  if (isPending && !selectedRole) {
    return (
      <AuthPageShell title="Signing you in" subtitle="Preparing your HirePilot workspace.">
        <Stack spacing={2.25} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Signing you in...</Typography>
        </Stack>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell title="Complete Your Registration" subtitle="Choose how you want to use HirePilot">
      <Stack spacing={2.5}>
        {mutation.isError ? (
          <Alert severity="error">
            {getApiErrorMessage(mutation.error) || "Failed to complete registration. Please try again."}
          </Alert>
        ) : null}

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          {roleOptions.map((role) => {
            const selected = selectedRole === role.value;

            return (
              <Card
                key={role.value}
                variant="outlined"
                sx={{
                  height: "100%",
                  borderColor: selected ? "primary.main" : "divider",
                  borderWidth: selected ? 2 : 1,
                  bgcolor: selected ? "action.selected" : "background.paper",
                  transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardActionArea
                  disabled={isPending}
                  onClick={() => setSelectedRole(role.value)}
                  sx={{ height: "100%", alignItems: "stretch" }}
                >
                  <CardContent sx={{ height: "100%", p: 2.5 }}>
                    <Stack spacing={1.75} sx={{ height: "100%" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "8px",
                            bgcolor: selected ? "primary.main" : "action.hover",
                            color: selected ? "primary.contrastText" : "text.primary",
                          }}
                        >
                          {role.icon}
                        </Box>
                        {selected ? <CheckCircleIcon color="primary" /> : null}
                      </Stack>

                      <Stack spacing={0.75}>
                        <Typography variant="h4" component="h2">
                          {role.title}
                        </Typography>
                        <Typography color="text.secondary">{role.description}</Typography>
                      </Stack>

                      <Stack spacing={1}>
                        {role.features.map((feature) => (
                          <Stack key={feature} direction="row" alignItems="center" spacing={1}>
                            <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />
                            <Typography>{feature}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>

        <Button
          type="button"
          variant="contained"
          size="large"
          disabled={!selectedRole || isPending}
          onClick={() => {
            if (selectedRole) {
              mutation.mutate(selectedRole);
            }
          }}
          startIcon={isPending ? <CircularProgress color="inherit" size={18} /> : undefined}
        >
          {isPending ? "Creating Account..." : "Continue"}
        </Button>
      </Stack>
    </AuthPageShell>
  );
}
