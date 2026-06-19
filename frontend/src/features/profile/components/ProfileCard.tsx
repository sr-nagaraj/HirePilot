import EditIcon from "@mui/icons-material/Edit";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Tabs,
  Tab,
  alpha,
  useTheme,
  Grid,
} from "@mui/material";
import { useState, type ReactNode } from "react";
import type { AuthRole } from "../../../shared/types/auth";
import { API_BASE_URL } from "../../../shared/constants/app";
import type { Profile } from "../types/profile";

interface ProfileCardProps {
  profile: Profile | null;
  completion: number;
  fallbackEmail: string | null;
  role: AuthRole | null;
  onEdit: () => void;
}

function splitSkills(skills?: string) {
  return (skills ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number | null;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
      <Box sx={{ color: "primary.main", display: "flex", pt: 0.25 }}>{icon}</Box>
      <Stack spacing={0.25}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        <Typography fontWeight={700}>{value || "Not specified"}</Typography>
      </Stack>
    </Stack>
  );
}

export function ProfileCard({ profile, completion, fallbackEmail, role, onEdit }: ProfileCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [tabVal, setTabVal] = useState(0);
  
  const isRecruiter = role === "RECRUITER";
  const skills = splitSkills(profile?.skills);
  const displayName = profile?.fullName || (isRecruiter ? "Recruiter" : "Candidate");
  const aboutMe = profile?.aboutMe ?? profile?.bio;
  const websiteUrl = profile?.websiteUrl ?? profile?.portfolio;
  const headline =
    isRecruiter && (profile?.designation || profile?.companyName)
      ? [profile?.designation, profile?.companyName].filter(Boolean).join(" - ")
      : profile?.headline;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  return (
    <Stack spacing={3}>
      {/* Hero Section */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          border: "1px solid",
          borderColor: "divider",
          background: isDark
            ? "linear-gradient(180deg, rgba(45,212,191,0.08) 0%, rgba(24,24,27,0) 100%)"
            : "linear-gradient(180deg, rgba(15,118,110,0.04) 0%, rgba(255,255,255,0) 100%)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
              <Avatar
                src={
                  profile?.profilePicture
                    ? profile.profilePicture.startsWith("http")
                      ? profile.profilePicture
                      : `${API_BASE_URL}/${profile.profilePicture}`
                    : undefined
                }
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  bgcolor: "primary.main",
                  fontSize: { xs: 32, md: 40 },
                  fontWeight: 700,
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              
              <Stack spacing={0.75}>
                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                  {displayName}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  {headline || "Complete your profile to stand out."}
                </Typography>
                {profile?.location && (
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: "text.secondary" }}>
                    <LocationOnIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{profile.location}</Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={onEdit}
              sx={{ px: 3, py: 1.25, borderRadius: 2 }}
            >
              Edit Profile
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Completion status card */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight={700}>
                Profile Completion Status
              </Typography>
              <Typography variant="body1" fontWeight={800} color="primary.main">
                {completion}% Complete
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completion}
              sx={{ height: 10, borderRadius: 5, bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)" }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Content panel with tabs */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <Tabs
          value={tabVal}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            "& .MuiTab-root": {
              fontWeight: 700,
              py: 2,
            },
          }}
        >
          <Tab label="Overview" />
          {isRecruiter && <Tab label="Company" />}
          <Tab label="Social Links" />
          <Tab label="Settings" />
        </Tabs>

        <CardContent sx={{ p: 3.5 }}>
          {/* Tab 0: Overview */}
          {tabVal === 0 && (
            <Stack spacing={3.5}>
              <Stack spacing={1.5}>
                <Typography variant="h3" fontWeight={700}>
                  {isRecruiter ? "Biography" : "About Me"}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                  {aboutMe || "Add details about your professional journey and career achievements."}
                </Typography>
              </Stack>
              
              <Divider />
              
              {!isRecruiter && (
                <>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.5}>
                        <Typography variant="h3" fontWeight={700}>
                          Experience
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <WorkIcon color="primary" />
                          <Typography variant="body1">
                            {profile?.experience !== undefined && profile?.experience !== null
                              ? `${profile.experience} Year${profile.experience === 1 ? "" : "s"}`
                              : "Not specified"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.5}>
                        <Typography variant="h3" fontWeight={700}>
                          Education
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <SchoolIcon color="primary" />
                          <Typography variant="body1">
                            {profile?.education || "Not specified"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              )}

              <Stack spacing={1.5}>
                <Typography variant="h3" fontWeight={700}>
                  Key Skills & Qualifications
                </Typography>
                {skills.length ? (
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {skills.map((skill) => (
                      <Chip key={skill} label={skill} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary" variant="body2" fontStyle="italic">No skills added yet.</Typography>
                )}
              </Stack>
            </Stack>
          )}

          {/* Tab 1: Company details (only for recruiters) */}
          {tabVal === 1 && isRecruiter && (
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <InfoItem icon={<BusinessIcon />} label="Company Name" value={profile?.companyName} />
              <InfoItem icon={<BadgeIcon />} label="Designation" value={profile?.designation} />
            </Box>
          )}

          {/* Tab 2 (Social Links for candidate, Tab 1 for recruiter, Tab 2 for recruiter) */}
          {((tabVal === 1 && !isRecruiter) || (tabVal === 2 && isRecruiter)) && (
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
              <InfoItem icon={<LinkedInIcon />} label="LinkedIn URL" value={profile?.linkedinUrl} />
              <InfoItem icon={<GitHubIcon />} label="GitHub URL" value={profile?.githubUrl} />
              <InfoItem icon={<LanguageIcon />} label="Website / Portfolio" value={websiteUrl} />
            </Box>
          )}

          {/* Tab 3 (Settings for recruiter, Tab 2 for candidate) */}
          {((tabVal === 2 && !isRecruiter) || (tabVal === 3 && isRecruiter)) && (
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
              <InfoItem icon={<MailIcon />} label="Email Address" value={profile?.email || fallbackEmail} />
              <InfoItem icon={<PhoneIcon />} label="Phone Number" value={profile?.phone || profile?.phoneNumber} />
              <InfoItem icon={<LocationOnIcon />} label="Location" value={profile?.location} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
