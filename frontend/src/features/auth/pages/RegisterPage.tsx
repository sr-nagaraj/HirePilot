import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../../services/apiClient";
import { SEO } from "../../../shared/components/SEO";
import { ROUTES } from "../../../shared/constants/routes";
import { AuthPageShell } from "../components/AuthPageShell";
import { RoleSelectionCards } from "../components/RoleSelectionCards";
import { sendOtp } from "../api/authApi";
import { startGoogleOAuth } from "../constants/oauth";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import {
  otpSchema,
  registerSchema,
  type RegisterWithOtpFormValues,
} from "../schemas/authSchemas";

const steps = ["Enter Details", "Verify Email"];
const RESEND_SECONDS = 60;
const registerResolver = zodResolver(registerSchema) as Resolver<RegisterWithOtpFormValues>;

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (!password) {
    return { label: "Weak", value: 0, color: "error.main" };
  }

  if (score <= 2) {
    return { label: "Weak", value: 30, color: "error.main" };
  }

  if (score === 3) {
    return { label: "Medium", value: 55, color: "warning.main" };
  }

  if (score === 4) {
    return { label: "Strong", value: 78, color: "primary.main" };
  }

  return { label: "Very Strong", value: 100, color: "success.main" };
}

export function RegisterPage() {
  const registerMutation = useRegisterMutation();
  const sendOtpMutation = useMutation({ mutationFn: sendOtp });
  const [activeStep, setActiveStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setError,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterWithOtpFormValues>({
    resolver: registerResolver,
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CANDIDATE",
      otp: "",
    },
  });
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otpValue = watch("otp");
  const passwordStrength = getPasswordStrength(password);
  const hasConfirmPassword = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  async function handleSendOtp() {
    setSuccessMessage(null);
    setErrorMessage(null);

    const isValid = await trigger(["fullName", "email", "password", "confirmPassword", "role"]);

    if (!isValid) {
      setErrorMessage("Please complete the required details before requesting an OTP.");
      return;
    }

    try {
      const response = await sendOtpMutation.mutateAsync(getValues("email"));
      setActiveStep(1);
      setCountdown(RESEND_SECONDS);
      setValue("otp", "");
      setSuccessMessage(response.message || "OTP sent successfully. Check your email.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error) || "Failed to send OTP.");
    }
  }

  async function handleRegister(values: RegisterWithOtpFormValues) {
    setSuccessMessage(null);
    setErrorMessage(null);

    const otpResult = otpSchema.safeParse({ otp: values.otp });

    if (!otpResult.success) {
      setError("otp", { message: otpResult.error.issues[0]?.message || "Enter the 6-digit verification code." });
      setErrorMessage("Enter the 6-digit verification code.");
      return;
    }

    registerMutation.mutate(values, {
      onError: (error) => {
        setErrorMessage(getApiErrorMessage(error) || "Registration failed.");
      },
    });
  }

  const isSendingOtp = sendOtpMutation.isPending;
  const isRegistering = registerMutation.isPending;
  const isBusy = isSendingOtp || isRegistering;

  return (
    <>
      <SEO
        title="Register | HirePilot"
        description="Create your HirePilot account as a candidate or recruiter and verify your email with OTP."
        canonicalPath={ROUTES.REGISTER}
      />
      <AuthPageShell title="Create Account" subtitle="Choose your HirePilot role and verify your email.">
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit(handleRegister)}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {activeStep === 0 ? (
          <Stack spacing={2.25}>
            <TextField
              label="Full Name"
              autoComplete="name"
              {...register("fullName")}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
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
              autoComplete="new-password"
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
            <Stack spacing={0.75}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Password strength
                </Typography>
                <Typography variant="body2" fontWeight={800} sx={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </Typography>
              </Stack>
              <Box sx={{ height: 8, borderRadius: 999, bgcolor: "action.hover", overflow: "hidden" }}>
                <Box
                  sx={{
                    width: `${passwordStrength.value}%`,
                    height: "100%",
                    bgcolor: passwordStrength.color,
                    transition: "width 180ms ease",
                  }}
                />
              </Box>
            </Stack>
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword")}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      edge="end"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {hasConfirmPassword ? (
              <Alert severity={passwordsMatch ? "success" : "error"} sx={{ py: 0.5 }}>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </Alert>
            ) : null}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RoleSelectionCards
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.role?.message}
                />
              )}
            />
            <Button
              type="button"
              variant="contained"
              size="large"
              startIcon={isSendingOtp ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
              disabled={isBusy || !isValid}
              onClick={handleSendOtp}
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2.25} alignItems="stretch">
            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="info">
              Check your email for the 6-digit verification code.
            </Alert>

            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Verification Code"
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  error={Boolean(errors.otp)}
                  helperText={errors.otp?.message}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 6,
                    pattern: "[0-9]*",
                    sx: { textAlign: "center", fontSize: "1.35rem", letterSpacing: "0.25rem" },
                  }}
                  sx={{ maxWidth: 280, alignSelf: "center" }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isRegistering ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
              disabled={isBusy || otpValue.length !== 6}
            >
              {isRegistering ? "Creating Account..." : "Verify & Register"}
            </Button>

            <Button type="button" variant="text" disabled={isBusy || countdown > 0} onClick={handleSendOtp}>
              {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              disabled={isBusy}
              onClick={() => {
                setActiveStep(0);
                setSuccessMessage(null);
                setErrorMessage(null);
              }}
            >
              Edit Details
            </Button>
          </Stack>
        )}

        <Divider />

        <Button
          type="button"
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={startGoogleOAuth}
          disabled={isBusy}
        >
          Continue with Google
        </Button>
        <Button component={Link} to={ROUTES.LOGIN} variant="outlined" startIcon={<LoginIcon />} disabled={isBusy}>
          Login
        </Button>
        </Stack>
      </AuthPageShell>
    </>
  );
}
