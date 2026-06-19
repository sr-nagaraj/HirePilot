import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "../../../shared/components/SEO";
import { REMEMBERED_EMAIL_KEY } from "../../../shared/constants/app";
import { ROUTES } from "../../../shared/constants/routes";
import { AuthPageShell } from "../components/AuthPageShell";
import { OAUTH_FLOW_STORAGE_KEY, startGoogleOAuth } from "../constants/oauth";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { loginSchema, type LoginFormValues } from "../schemas/authSchemas";

function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
}

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const mutation = useLoginMutation();
  const hasExpiredSession = Boolean(searchParams.get("expired"));
  const hasOAuthAttempt = sessionStorage.getItem(OAUTH_FLOW_STORAGE_KEY) === "google";
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: getRememberedEmail(),
      password: "",
      rememberMe: true,
    },
  });

  return (
    <>
      <SEO
        title="Login | HirePilot"
        description="Log in to your HirePilot workspace to manage jobs, applications, resumes, and AI-powered hiring workflows."
        canonicalPath={ROUTES.LOGIN}
      />
      <AuthPageShell title="Login" subtitle="Access your HirePilot workspace.">
        <Stack component="form" spacing={2.25} onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        {hasExpiredSession ? (
          <Alert severity="warning">
            {hasOAuthAttempt
              ? "Google sign-in could not be completed. Please try again."
              : "Your session expired. Please log in again."}
          </Alert>
        ) : null}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          {...register("password")}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  edge="end"
                  onClick={() => setShowPassword((current) => !current)}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <FormControlLabel
            control={<Checkbox defaultChecked {...register("rememberMe")} />}
            label="Remember me"
          />
          <Typography component={Link} to={ROUTES.FORGOT_PASSWORD} color="primary" fontWeight={700}>
            Forgot password?
          </Typography>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={mutation.isPending ? <CircularProgress size={18} /> : <LoginIcon />}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Signing in..." : "Login"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={startGoogleOAuth}
          disabled={mutation.isPending}
        >
          Continue with Google
        </Button>
        <Button component={Link} to={ROUTES.REGISTER} variant="outlined" startIcon={<LockIcon />} disabled={mutation.isPending}>
          Create Account
        </Button>
        </Stack>
      </AuthPageShell>
    </>
  );
}
