import { zodResolver } from "@hookform/resolvers/zod";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import type { AuthRole } from "../../../shared/types/auth";
import { API_BASE_URL } from "../../../shared/constants/app";
import { formValuesToProfilePayload, profileToFormValues } from "../api/profileApi";
import { useUpdateProfileMutation } from "../hooks/useProfileMutation";
import { useUploadProfilePicture } from "../hooks/useProfileMutation";
import { profileSchema, type ProfileSchemaValues } from "../schemas/profileSchema";
import type { Profile } from "../types/profile";
import { useEffect } from "react";

interface ProfileFormProps {
  profile: Profile | null;
  fallbackEmail: string | null;
  role: AuthRole | null;
  submitLabel?: string;
  onCancel?: () => void;
  onSaved?: () => void;
}

export function ProfileForm({
  profile,
  fallbackEmail,
  role,
  submitLabel = "Save Profile",
  onCancel,
  onSaved,
}: ProfileFormProps) {
  const updateProfile = useUpdateProfileMutation();
  const uploadPicture = useUploadProfilePicture();
  const isRecruiter = role === "RECRUITER";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileSchemaValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileToFormValues(profile, fallbackEmail),
  });

  const currentProfilePicture = watch("profilePicture");

  useEffect(() => {
    reset(profileToFormValues(profile, fallbackEmail));
  }, [fallbackEmail, profile, reset]);

  function onSubmit(values: ProfileSchemaValues) {
    updateProfile.mutate(formValuesToProfilePayload(values), {
      onSuccess: onSaved,
    });
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    uploadPicture.mutate(file, {
      onSuccess: (imagePath) => {
        setValue("profilePicture", imagePath, { shouldDirty: true });
      },
    });

    // Reset input so the same file can be re-selected
    event.target.value = "";
  }

  function getAvatarSrc(): string | undefined {
    if (!currentProfilePicture) return undefined;
    // If the path is already an absolute URL, use as-is; otherwise prefix with API_BASE_URL
    if (currentProfilePicture.startsWith("http")) return currentProfilePicture;
    return `${API_BASE_URL}/${currentProfilePicture}`;
  }

  const displayName = profile?.fullName || "U";

  return (
    <Stack component="form" spacing={2.25} onSubmit={handleSubmit(onSubmit)}>
      {/* Profile Picture Upload */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Avatar
          src={getAvatarSrc()}
          sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: 24 }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              startIcon={
                uploadPicture.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <CloudUploadIcon />
                )
              }
              disabled={uploadPicture.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadPicture.isPending ? "Uploading…" : "Upload Image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />
          </Stack>

          {selectedFileName && !uploadPicture.isPending && !uploadPicture.isError && (
            <Typography variant="caption" color="text.secondary">
              {selectedFileName}
            </Typography>
          )}

          {uploadPicture.isError && (
            <Alert severity="error" sx={{ py: 0, mt: 0.5 }}>
              Upload failed. Please try again.
            </Alert>
          )}
        </Stack>
      </Box>

      <TextField
        label="Full Name"
        {...register("fullName")}
        error={Boolean(errors.fullName)}
        helperText={errors.fullName?.message}
      />
      <TextField
        label="Headline"
        {...register("headline")}
        error={Boolean(errors.headline)}
        helperText={errors.headline?.message}
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Location"
          fullWidth
          {...register("location")}
          error={Boolean(errors.location)}
          helperText={errors.location?.message}
        />
        <TextField
          label="Phone"
          fullWidth
          {...register("phone")}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
      </Stack>

      {isRecruiter ? (
        <>
          <TextField
            label="Bio"
            multiline
            minRows={4}
            {...register("bio")}
            error={Boolean(errors.bio)}
            helperText={errors.bio?.message}
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Company Name"
              fullWidth
              {...register("companyName")}
              error={Boolean(errors.companyName)}
              helperText={errors.companyName?.message}
            />
            <TextField
              label="Designation"
              fullWidth
              {...register("designation")}
              error={Boolean(errors.designation)}
              helperText={errors.designation?.message}
            />
          </Stack>
        </>
      ) : (
        <TextField
          label="Email"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Controller
          name="experience"
          control={control}
          render={({ field }) => (
            <TextField
              label="Experience"
              type="number"
              fullWidth
              value={field.value ?? ""}
              onChange={(event) => {
                field.onChange(event.target.value === "" ? null : Number(event.target.value));
              }}
              error={Boolean(errors.experience)}
              helperText={errors.experience?.message}
            />
          )}
        />
        <TextField
          label="Education"
          fullWidth
          {...register("education")}
          error={Boolean(errors.education)}
          helperText={errors.education?.message}
        />
      </Stack>

      <TextField
        label="Skills"
        multiline
        minRows={2}
        placeholder="Recruiting, Sourcing, Technical Hiring"
        {...register("skills")}
        error={Boolean(errors.skills)}
        helperText={errors.skills?.message || "Separate skills with commas."}
      />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="LinkedIn URL"
          fullWidth
          {...register("linkedinUrl")}
          error={Boolean(errors.linkedinUrl)}
          helperText={errors.linkedinUrl?.message}
        />
        <TextField
          label="GitHub URL"
          fullWidth
          {...register("githubUrl")}
          error={Boolean(errors.githubUrl)}
          helperText={errors.githubUrl?.message}
        />
      </Stack>
      <TextField
        label="Website URL"
        fullWidth
        {...register("websiteUrl")}
        error={Boolean(errors.websiteUrl)}
        helperText={errors.websiteUrl?.message}
      />

      {!isRecruiter ? (
        <TextField
          label="About Me"
          multiline
          minRows={4}
          {...register("aboutMe")}
          error={Boolean(errors.aboutMe)}
          helperText={errors.aboutMe?.message}
        />
      ) : null}

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        {onCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
        <Button type="submit" variant="contained" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving..." : submitLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
