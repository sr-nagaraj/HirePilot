import { Avatar, Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { API_BASE_URL } from "../../../shared/constants/app";
import type { CandidateProfile } from "../types/applicantTypes";

interface ApplicantProfileCardProps {
  profile: CandidateProfile | null;
  candidateId: number;
}

export function ApplicantProfileCard({ profile, candidateId }: ApplicantProfileCardProps) {
  const displayName = profile?.fullName || `Candidate #${candidateId}`;
  const headline = profile?.headline || profile?.designation || "";
  const location = profile?.location || "";

  const avatarSrc = profile?.profilePicture
    ? profile.profilePicture.startsWith("http")
      ? profile.profilePicture
      : `${API_BASE_URL}/${profile.profilePicture}`
    : undefined;

  return (
    <Stack direction="row" spacing={2} alignItems="center" py={1}>
      <Avatar
        src={avatarSrc}
        sx={{ width: 44, height: 44, bgcolor: "primary.main", fontSize: 18, fontWeight: 600 }}
      >
        {displayName.charAt(0).toUpperCase()}
      </Avatar>
      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography variant="body1" fontWeight={700} noWrap sx={{ color: "text.primary" }}>
          {displayName}
        </Typography>
        {headline && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {headline}
          </Typography>
        )}
        {location && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
            <LocationOnIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" noWrap>
              {location}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
