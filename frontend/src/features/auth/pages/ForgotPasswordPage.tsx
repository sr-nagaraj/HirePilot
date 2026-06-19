import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockResetIcon from "@mui/icons-material/LockReset";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../../services/apiClient";
import { SEO } from "../../../shared/components/SEO";
import { ROUTES } from "../../../shared/constants/routes";
import { useToast } from "../../../shared/hooks/useToast";
import { AuthPageShell } from "../components/AuthPageShell";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/authSchemas";
import {
  resetPassword,
  sendForgotPasswordOtp,
} from "../services/passwordService";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectPending, setRedirectPending] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendForgotPasswordOtp,
    onSuccess: (message) => {
      setOtpSent(true);
      showToast(message || "OTP sent successfully", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error) || "Failed to send OTP.", "error");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (message) => {
      setRedirectPending(true);
      showToast(message || "Password reset successful", "success");
    },
    onError: (error) => {
      showToast(getApiErrorMessage(error) || "Password reset failed.", "error");
    },
  });

  useEffect(() => {
    if (!redirectPending) {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate(ROUTES.LOGIN, { replace: true });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [navigate, redirectPending]);

  async function handleSendOtp() {
    const emailIsValid = await trigger("email");

    if (emailIsValid) {
      sendOtpMutation.mutate(getValues("email"));
    }
  }

  function handleResetPassword(values: ResetPasswordFormValues) {
    resetPasswordMutation.mutate({
      email: values.email,
      otp: values.otp,
      newPassword: values.newPassword,
    });
  }

  const isBusy = sendOtpMutation.isPending || resetPasswordMutation.isPending || redirectPending;

  return (
    <>
      <SEO
        title="Forgot Password | HirePilot"
        description="Reset your HirePilot account password using an email OTP."
        canonicalPath={ROUTES.FORGOT_PASSWORD}
      />
      <AuthPageShell title="Forgot Password" subtitle="Request an OTP to reset your password.">
        <Stack component="form" spacing={2.25} onSubmit={handleSubmit(handleResetPassword)}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            disabled={otpSent || isBusy}
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <Button
            type="button"
            variant="contained"
            size="large"
            disabled={isBusy || otpSent}
            startIcon={sendOtpMutation.isPending ? <CircularProgress size={18} /> : <MailOutlineIcon />}
            onClick={handleSendOtp}
          >
            {sendOtpMutation.isPending ? "Sending OTP..." : otpSent ? "OTP Sent" : "Send OTP"}
          </Button>

          <Collapse in={otpSent} unmountOnExit>
            <Stack spacing={2.25} sx={{ pt: 0.5 }}>
              <TextField
                label="OTP"
                autoComplete="one-time-code"
                disabled={isBusy}
                {...register("otp")}
                error={Boolean(errors.otp)}
                helperText={errors.otp?.message}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isBusy}
                {...register("newPassword")}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        edge="end"
                        disabled={isBusy}
                        onClick={() => setShowNewPassword((current) => !current)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isBusy}
                {...register("confirmPassword")}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                        edge="end"
                        disabled={isBusy}
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isBusy}
                startIcon={resetPasswordMutation.isPending ? <CircularProgress size={18} /> : <LockResetIcon />}
              >
                {resetPasswordMutation.isPending
                  ? "Resetting Password..."
                  : redirectPending
                    ? "Redirecting to Login..."
                    : "Reset Password"}
              </Button>
            </Stack>
          </Collapse>

          <Button component={Link} to={ROUTES.LOGIN} variant="outlined" startIcon={<ArrowBackIcon />} disabled={isBusy}>
            Back to Login
          </Button>
        </Stack>
      </AuthPageShell>
    </>
  );
}
