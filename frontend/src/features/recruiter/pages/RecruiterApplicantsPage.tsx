import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WorkIcon from "@mui/icons-material/Work";
import DownloadIcon from "@mui/icons-material/Download";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
  IconButton,
  Chip,
  Typography,
  Box,
  Divider,
  Avatar,
  Paper,
  alpha,
  useTheme,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusChip } from "../../../shared/components/StatusChip";
import { formatDate } from "../../../shared/utils/formatters";
import { API_BASE_URL } from "../../../shared/constants/app";
import {
  useRecruiterJobQuery,
  useUpdateApplicationStatusMutation,
} from "../hooks/recruiterJobHooks";
import { useApplicantDetailsQuery } from "../hooks/useApplicantDetailsQuery";
import type { ApplicantDetails } from "../types/applicantTypes";
import type { RecruiterApplicationStatus } from "../types/recruiterDashboard";

const statusActions: Array<{ label: string; status: RecruiterApplicationStatus }> = [
  { label: "Reviewed", status: "REVIEWED" },
  { label: "Shortlist", status: "SHORTLISTED" },
  { label: "Interview", status: "INTERVIEW_SCHEDULED" },
  { label: "Hire", status: "HIRED" },
  { label: "Reject", status: "REJECTED" },
];

export function RecruiterApplicantsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { jobId } = useParams();
  const { data: job, isLoading: isJobLoading, isError: isJobError } = useRecruiterJobQuery(jobId);
  const {
    data: applications = [],
    isLoading: areApplicationsLoading,
    isError: areApplicationsError,
  } = useApplicantDetailsQuery(jobId);
  const updateStatus = useUpdateApplicationStatusMutation(jobId);
  
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDetails | null>(null);

  const isLoading = isJobLoading || areApplicationsLoading;
  const isError = isJobError || areApplicationsError;

  // Auto-select first applicant on load
  useEffect(() => {
    if (applications.length && !selectedApplicant) {
      setSelectedApplicant(applications[0]);
    }
  }, [applications, selectedApplicant]);

  const handleSelectApplicant = (applicant: ApplicantDetails) => {
    setSelectedApplicant(applicant);
  };

  const getScoreColor = (score?: number) => {
    if (score === undefined || score === null) return "default";
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "error";
  };

  const currentStatus = selectedApplicant?.applicationStatus;

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header with back button */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component={Link}
            to="/recruiter/jobs"
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
          >
            Back to Jobs
          </Button>
          <PageHeader
            title="Applicant Pipeline"
            subtitle={job ? `${job.title} - ${applications.length} applications` : "Review candidate applications."}
          />
        </Stack>

        {isLoading ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton variant="rounded" height={600} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        ) : null}

        {isError ? <ErrorState message="Applicants could not be loaded." /> : null}

        {!isLoading && !isError && !job ? (
          <EmptyState icon={<WorkIcon />} title="Job not found" description="This job may no longer be available." />
        ) : null}

        {!isLoading && !isError && job && applications.length === 0 ? (
          <EmptyState
            icon={<AssignmentTurnedInIcon />}
            title="No applicants yet"
            description="Applicants will appear here after candidates apply."
          />
        ) : null}

        {job && applications.length > 0 && selectedApplicant ? (
          <Grid container spacing={3} sx={{ minHeight: "calc(100vh - 200px)", alignItems: "stretch" }}>
            {/* Left Panel: Applicants List */}
            <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  maxHeight: "calc(100vh - 200px)",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                }}
              >
                <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
                  <Typography variant="h4" fontWeight={700}>
                    Candidates ({applications.length})
                  </Typography>
                </Box>
                
                <Stack sx={{ overflowY: "auto", flexGrow: 1, p: 1.5 }} spacing={1.5}>
                  {applications.map((app) => {
                    const isSelected = selectedApplicant.applicationId === app.applicationId;
                    const score = app.resumeScore?.overallScore;
                    const displayName = app.profile?.fullName || `Candidate #${app.userId}`;
                    
                    return (
                      <Box
                        key={app.applicationId}
                        onClick={() => handleSelectApplicant(app)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: isSelected
                            ? isDark
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.primary.main, 0.05)
                            : "transparent",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: isSelected
                              ? undefined
                              : isDark
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(0,0,0,0.02)",
                            borderColor: isSelected ? "primary.main" : "text.secondary",
                          },
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                              <Avatar sx={{ bgcolor: "primary.main", width: 28, height: 28, fontSize: "0.8rem", fontWeight: 700 }}>
                                {displayName.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight={700} noWrap>
                                {displayName}
                              </Typography>
                            </Stack>
                            {score !== undefined && score !== null ? (
                              <Chip
                                label={`${score}%`}
                                size="small"
                                color={getScoreColor(score)}
                                sx={{ height: 20, fontSize: "0.75rem", fontWeight: 700 }}
                              />
                            ) : (
                              <Chip
                                label="N/A"
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              Applied {formatDate(app.appliedDate)}
                            </Typography>
                            <StatusChip status={app.applicationStatus} />
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Card>
            </Grid>

            {/* Right Panel: Applicant Profile Details */}
            <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  maxHeight: "calc(100vh - 200px)",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                }}
              >
                {/* Detail Header Action Toolbar */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      src={
                        selectedApplicant.profile?.profilePicture
                          ? selectedApplicant.profile.profilePicture.startsWith("http")
                            ? selectedApplicant.profile.profilePicture
                            : `${API_BASE_URL}/${selectedApplicant.profile.profilePicture}`
                          : undefined
                      }
                      sx={{ width: 44, height: 44, bgcolor: "primary.main", fontSize: "1.1rem", fontWeight: 700 }}
                    >
                      {(selectedApplicant.profile?.fullName || "C").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {selectedApplicant.profile?.fullName || `Candidate #${selectedApplicant.userId}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedApplicant.profile?.headline || "Applicant"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Stage transition controls */}
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {statusActions.map((action) => {
                      const isActiveState = currentStatus === action.status;
                      return (
                        <Button
                          key={action.status}
                          size="small"
                          variant={isActiveState ? "contained" : "outlined"}
                          color={action.status === "REJECTED" ? "error" : "primary"}
                          disabled={updateStatus.isPending || isActiveState}
                          onClick={() =>
                            updateStatus.mutate({
                              applicationId: selectedApplicant.applicationId,
                              status: action.status,
                            })
                          }
                          sx={{ fontWeight: 700 }}
                        >
                          {action.label}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Detail content scroll */}
                <Box sx={{ overflowY: "auto", flexGrow: 1, p: 3 }}>
                  <Grid container spacing={4}>
                    {/* Main Bio / General Details */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                      <Stack spacing={4}>
                        {/* Summary / Bio */}
                        <Stack spacing={1}>
                          <Typography variant="h4" fontWeight={700}>
                            Candidate Summary
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                            {selectedApplicant.profile?.bio || "No summary profile details provided."}
                          </Typography>
                        </Stack>

                        <Divider />

                        {/* Experience and Education */}
                        <Stack spacing={2}>
                          <Typography variant="h4" fontWeight={700}>
                            Professional Context
                          </Typography>
                          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                            <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "flex-start", gap: 1.5, borderRadius: 2 }}>
                              <WorkIcon color="primary" sx={{ mt: 0.25 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Experience
                                </Typography>
                                <Typography variant="body2" fontWeight={700}>
                                  {selectedApplicant.profile?.experience !== undefined && selectedApplicant.profile?.experience !== null
                                    ? `${selectedApplicant.profile.experience} Year${selectedApplicant.profile.experience === 1 ? "" : "s"}`
                                    : "Not specified"}
                                </Typography>
                              </Box>
                            </Paper>
                            <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "flex-start", gap: 1.5, borderRadius: 2 }}>
                              <SchoolIcon color="primary" sx={{ mt: 0.25 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Education
                                </Typography>
                                <Typography variant="body2" fontWeight={700}>
                                  {selectedApplicant.profile?.education || "Not specified"}
                                </Typography>
                              </Box>
                            </Paper>
                          </Box>
                        </Stack>

                        <Divider />

                        {/* Skills chips */}
                        <Stack spacing={1.5}>
                          <Typography variant="h4" fontWeight={700}>
                            Core Skills
                          </Typography>
                          {selectedApplicant.profile?.skills ? (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
                              {selectedApplicant.profile.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="outlined" color="primary" sx={{ fontWeight: 600 }} />
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              No skills listed.
                            </Typography>
                          )}
                        </Stack>

                        <Divider />

                        {/* Resume section */}
                        <Stack spacing={1.5}>
                          <Typography variant="h4" fontWeight={700}>
                            Attached Resume File
                          </Typography>
                          {selectedApplicant.resume ? (
                            <Paper variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2 }}>
                              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1, mr: 2 }}>
                                <DescriptionIcon color="action" />
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="body2" fontWeight={700} noWrap>
                                    {selectedApplicant.resume.fileName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Uploaded: {new Date(selectedApplicant.resume.uploadedAt || "").toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<DownloadIcon />}
                                href={
                                  selectedApplicant.resume.fileUrl.startsWith("http")
                                    ? selectedApplicant.resume.fileUrl
                                    : `${API_BASE_URL}/${selectedApplicant.resume.fileUrl}`
                                }
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </Button>
                            </Paper>
                          ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              No resume attached.
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Grid>

                    {/* Right side widgets (ATS Analytics & Contacts) */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                      <Stack spacing={3}>
                        {/* ATS Score details */}
                        <Card variant="outlined" sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={2}>
                              <Typography variant="h4" fontWeight={700}>
                                ATS Match Score
                              </Typography>
                              
                              {selectedApplicant.resumeScore ? (
                                <Stack spacing={2.5}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" fontWeight={700}>
                                      Overall Alignment
                                    </Typography>
                                    <Chip
                                      label={`${selectedApplicant.resumeScore.overallScore}%`}
                                      color={getScoreColor(selectedApplicant.resumeScore.overallScore)}
                                      size="small"
                                      sx={{ fontWeight: 700 }}
                                    />
                                  </Stack>
                                  
                                  <Divider />
                                  
                                  <Stack spacing={1.5}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="caption" color="text.secondary">Skills Alignment</Typography>
                                      <Typography variant="caption" fontWeight={700}>{selectedApplicant.resumeScore.skillsMatch}%</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="caption" color="text.secondary">Experience Alignment</Typography>
                                      <Typography variant="caption" fontWeight={700}>{selectedApplicant.resumeScore.experienceMatch}%</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="caption" color="text.secondary">Education Alignment</Typography>
                                      <Typography variant="caption" fontWeight={700}>{selectedApplicant.resumeScore.educationMatch}%</Typography>
                                    </Box>
                                  </Stack>
                                </Stack>
                              ) : (
                                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ p: 1.5, bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", borderRadius: 2 }}>
                                  <StarIcon sx={{ fontSize: 18, color: "text.secondary", mt: 0.25 }} />
                                  <Box>
                                    <Typography variant="body2" fontWeight={700}>Not Scored</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Use the Resume Score page to analyze alignment.
                                    </Typography>
                                  </Box>
                                </Stack>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>

                        {/* Candidate Contact */}
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={2.5}>
                              <Typography variant="h4" fontWeight={700}>
                                Contact Info
                              </Typography>
                              
                              <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <MailIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                    {selectedApplicant.profile?.email || "No email"}
                                  </Typography>
                                </Stack>
                                
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <PhoneIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                                  <Typography variant="body2">
                                    {selectedApplicant.profile?.phoneNumber || "No phone number"}
                                  </Typography>
                                </Stack>
                                
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <LocationOnIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                                  <Typography variant="body2">
                                    {selectedApplicant.profile?.location || "No location details"}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Divider />

                              {/* Social Portfolio Links */}
                              <Stack direction="row" spacing={1}>
                                {selectedApplicant.profile?.linkedinUrl && (
                                  <IconButton
                                    component="a"
                                    href={selectedApplicant.profile.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: "#0077b5" }}
                                  >
                                    <LinkedInIcon />
                                  </IconButton>
                                )}
                                {selectedApplicant.profile?.githubUrl && (
                                  <IconButton
                                    component="a"
                                    href={selectedApplicant.profile.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: "text.primary" }}
                                  >
                                    <GitHubIcon />
                                  </IconButton>
                                )}
                                {selectedApplicant.profile?.websiteUrl && (
                                  <IconButton
                                    component="a"
                                    href={selectedApplicant.profile.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: "primary.main" }}
                                  >
                                    <LanguageIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>
        ) : null}
      </Stack>
    </Container>
  );
}
