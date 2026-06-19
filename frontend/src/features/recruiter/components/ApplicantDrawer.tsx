import {
  Drawer,
  IconButton,
  Box,
  Stack,
  Typography,
  Avatar,
  Divider,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import DescriptionIcon from "@mui/icons-material/Description";
import ScoreIcon from "@mui/icons-material/Score";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import type { ApplicantDetails } from "../types/applicantTypes";
import { API_BASE_URL } from "../../../shared/constants/app";

interface ApplicantDrawerProps {
  open: boolean;
  onClose: () => void;
  applicant: ApplicantDetails | null;
}

export function ApplicantDrawer({ open, onClose, applicant }: ApplicantDrawerProps) {
  if (!applicant) return null;

  const { profile, resume, resumeScore, userId } = applicant;
  const displayName = profile?.fullName || `Candidate #${userId}`;
  const headline = profile?.headline || profile?.designation || "";
  const location = profile?.location || "";
  
  const avatarSrc = profile?.profilePicture
    ? profile.profilePicture.startsWith("http")
      ? profile.profilePicture
      : `${API_BASE_URL}/${profile.profilePicture}`
    : undefined;

  const skills = profile?.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const resumeDownloadUrl = resume?.fileUrl
    ? resume.fileUrl.startsWith("http")
      ? resume.fileUrl
      : `${API_BASE_URL}/${resume.fileUrl}`
    : undefined;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 460 }, p: 0, display: "flex", flexDirection: "column" },
      }}
    >
      {/* Header Panel */}
      <Box sx={{ p: 3, bgcolor: "grey.50", borderBottom: 1, borderColor: "divider", position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16, color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>

        <Stack spacing={2} alignItems="center" sx={{ textAlign: "center", pt: 2 }}>
          <Avatar
            src={avatarSrc}
            sx={{ width: 90, height: 90, bgcolor: "primary.main", fontSize: 36, fontWeight: 700, boxShadow: 2 }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              {displayName}
            </Typography>
            {headline && (
              <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                {headline}
              </Typography>
            )}
            {location && (
              <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ color: "text.secondary" }}>
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{location}</Typography>
              </Stack>
            )}
          </Stack>

          {/* Social Links */}
          <Stack direction="row" spacing={1} justifyContent="center">
            {profile?.linkedinUrl && (
              <IconButton
                component="a"
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#0077b5" }}
              >
                <LinkedInIcon />
              </IconButton>
            )}
            {profile?.githubUrl && (
              <IconButton
                component="a"
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "text.primary" }}
              >
                <GitHubIcon />
              </IconButton>
            )}
            {profile?.websiteUrl && (
              <IconButton
                component="a"
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main" }}
              >
                <LanguageIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Main Content Pane */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
        <Stack spacing={3.5}>
          {/* Contact Details */}
          <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight={700}>
              Contact Information
            </Typography>
            <Stack spacing={1}>
              {profile?.email && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <MailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2">{profile.email}</Typography>
                </Stack>
              )}
              {profile?.phoneNumber && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="body2">{profile.phoneNumber}</Typography>
                </Stack>
              )}
              {!profile?.email && !profile?.phoneNumber && (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No contact information provided.
                </Typography>
              )}
            </Stack>
          </Stack>

          <Divider />

          {/* Bio / About */}
          <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight={700}>
              About Candidate
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
              {profile?.bio || "No professional summary provided."}
            </Typography>
          </Stack>

          <Divider />

          {/* Experience and Education */}
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              Work & Education
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <WorkIcon color="primary" sx={{ mt: 0.25 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Experience
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {profile?.experience !== undefined && profile?.experience !== null
                      ? `${profile.experience} Year${profile.experience === 1 ? "" : "s"}`
                      : "Not specified"}
                  </Typography>
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <SchoolIcon color="primary" sx={{ mt: 0.25 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Education
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                    {profile?.education || "Not specified"}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Stack>

          <Divider />

          {/* Skills */}
          <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight={700}>
              Key Skills
            </Typography>
            {skills.length > 0 ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" gap={1}>
                {skills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" color="primary" />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No key skills listed.
              </Typography>
            )}
          </Stack>

          <Divider />

          {/* Resume section */}
          <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight={700}>
              Application Resume
            </Typography>
            {resume ? (
              <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1, mr: 2 }}>
                  <DescriptionIcon color="action" />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {resume.fileName}
                    </Typography>
                    {resume.uploadedAt && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                {resumeDownloadUrl && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<DownloadIcon />}
                    href={resumeDownloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </Button>
                )}
              </Paper>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No resume is attached to this application.
              </Typography>
            )}
          </Stack>

          <Divider />

          {/* ATS Score Section */}
          <Stack spacing={1.5} pb={2}>
            <Typography variant="h6" fontWeight={700}>
              ATS Resume Analysis
            </Typography>
            {resumeScore ? (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={700}>
                      Overall Match Score
                    </Typography>
                    <Chip
                      label={`${resumeScore.overallScore}%`}
                      color={
                        resumeScore.overallScore >= 90
                          ? "success"
                          : resumeScore.overallScore >= 70
                          ? "warning"
                          : "error"
                      }
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <Divider />
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" align="center">
                        Skills Match
                      </Typography>
                      <Typography variant="body2" fontWeight={700} align="center">
                        {resumeScore.skillsMatch}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" align="center">
                        Exp Match
                      </Typography>
                      <Typography variant="body2" fontWeight={700} align="center">
                        {resumeScore.experienceMatch}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" align="center">
                        Edu Match
                      </Typography>
                      <Typography variant="body2" fontWeight={700} align="center">
                        {resumeScore.educationMatch}%
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <ScoreIcon color="action" />
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Not Analyzed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ATS matching score is not available. Standard AI-based matching and resume scoring will be enabled in a future version.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
