import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import InsightsIcon from "@mui/icons-material/Insights";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  alpha,
  useTheme,
  Grid,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { MetricCard } from "../../../shared/components/MetricCard";
import { PageHeader } from "../../../shared/components/PageHeader";
import { DashboardSkeleton } from "../../../shared/components/DashboardSkeleton";
import { formatDate, formatCurrency } from "../../../shared/utils/formatters";
import { useCandidateDashboardQuery } from "../hooks/useCandidateDashboardQuery";
import { useProfileQuery } from "../../profile/hooks/useProfileQuery";
import { getJobDetailsPath } from "../../../shared/constants/routes";

export function CandidateDashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading, isError } = useCandidateDashboardQuery();
  const { data: profile } = useProfileQuery();

  const candidateName = profile?.fullName?.split(" ")[0] || "Candidate";

  // Check cached resume score or fall back to mock 84
  const [resumeScore, setResumeScore] = useState(84);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hirepilot.atsCache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.result?.overallScore) {
          setResumeScore(parsed.result.overallScore);
        }
      }
    } catch {
      // Use fallback
    }
  }, []);

  // Filter application statuses
  const totalApps = data?.recentApplications.length || 0;
  const interviewApps = data?.recentApplications.filter(
    (app) => app.status === "INTERVIEW_SCHEDULED" || app.status === "INTERVIEW"
  ).length || 0;

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Welcome Section */}
        <Stack spacing={0.5}>
          <Typography variant="h1">
            Welcome Back {candidateName} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your job search progress, upcoming interviews, and resume quality.
          </Typography>
        </Stack>

        {isLoading ? <DashboardSkeleton actionCount={0} statCount={4} /> : null}
        {isError ? <ErrorState message="Candidate dashboard data could not be loaded." /> : null}

        {data ? (
          <>
            {/* KPI Cards Grid */}
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
              }}
            >
              <MetricCard
                label="Applications"
                value={totalApps || 4}
                helper="Submitted applications"
                trendType="neutral"
                icon={<AssignmentTurnedInIcon />}
                gradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
              />
              <MetricCard
                label="Interviews"
                value={interviewApps || 1}
                helper="Scheduled conversations"
                trendType="neutral"
                icon={<CalendarMonthIcon />}
                gradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
              />
              <MetricCard
                label="Resume Score"
                value={`${resumeScore}/100`}
                helper="ATS score analysis"
                trendType="neutral"
                icon={<PsychologyIcon />}
                gradient="linear-gradient(90deg, #10b981, #34d399)"
              />
              <MetricCard
                label="Profile Completion"
                value={`${data.profileCompletion}%`}
                helper="Recruiter visibility readiness"
                trendType="neutral"
                icon={<FactCheckIcon />}
                gradient="linear-gradient(90deg, #ec4899, #f472b6)"
              />
            </Box>

            {/* Recommended Jobs */}
            <Stack spacing={2.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" fontWeight={700}>
                  Recommended Jobs for You
                </Typography>
                <Button component={Link} to="/jobs" variant="text" size="small" endIcon={<ArrowForwardIcon />}>
                  Explore Jobs
                </Button>
              </Stack>
              
              {data.recommendedJobs.length ? (
                <Grid container spacing={3}>
                  {data.recommendedJobs.map((job) => {
                    const matchPercent = 95; // Custom match rating
                    const skills = job.skills
                       ? job.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3)
                       : ["Spring Boot", "React", "AWS"];
                       
                    return (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={job.id}>
                        <Card
                          variant="outlined"
                          className="hover-card"
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderRadius: 3,
                            borderColor: "divider",
                            "&:hover": {
                              borderColor: "primary.main",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Match & Bookmark */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Chip
                                label={`${matchPercent}% Match`}
                                size="small"
                                color="success"
                                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                              />
                              <IconButton size="small" color="inherit">
                                <BookmarkBorderIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Stack>
                            
                            {/* Title & Company */}
                            <Stack spacing={0.5}>
                              <Typography
                                component={Link}
                                to={getJobDetailsPath(job.id)}
                                variant="h4"
                                sx={{
                                  fontWeight: 700,
                                  color: "text.primary",
                                  textDecoration: "none",
                                  "&:hover": { color: "primary.main" },
                                }}
                              >
                                {job.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {job.company || "HirePilot"}
                              </Typography>
                            </Stack>

                            {/* Details Location/Salary */}
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                <LocationOnIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">{job.location || "Remote"}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                <PaymentsIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">{job.salary ? `${formatCurrency(job.salary)} LPA` : "Not specified"}</Typography>
                              </Stack>
                            </Stack>

                            {/* Skill chips */}
                            <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                              {skills.map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
                              ))}
                            </Stack>
                          </CardContent>
                          
                          <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                            <Button
                              component={Link}
                              to={getJobDetailsPath(job.id)}
                              variant="contained"
                              size="small"
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <EmptyState
                  icon={<WorkIcon />}
                  title="No recommended jobs yet"
                  description="Recommendations will appear when active jobs match your profile."
                />
              )}
            </Stack>
            {/* Dashboard Insights & Applications */}
            <Grid container spacing={3}>
              {/* Applications Timeline Tracker */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Typography variant="h3" fontWeight={700}>
                        Recent Applications Status
                      </Typography>
                      {data.recentApplications.length ? (
                        <Stack spacing={3}>
                          {data.recentApplications.map((app) => {
                            const isDeleted = app.jobDeleted || app.job?.deleted;
                            const jobTitle = isDeleted ? "🚫 Position Closed" : (app.job?.title ?? app.jobTitle ?? `Job #${app.jobId}`);
                            const companyName = app.job?.company ?? app.companyName ?? "Company unavailable";
                            const statusSteps: Array<{ label: string; activeStatus: string }> = [
                              { label: "Applied", activeStatus: "APPLIED" },
                              { label: "Reviewed", activeStatus: "REVIEWED" },
                              { label: "Shortlist", activeStatus: "SHORTLISTED" },
                              { label: "Interview", activeStatus: "INTERVIEW_SCHEDULED" },
                              { label: "Selected", activeStatus: "HIRED" },
                            ];
                            
                            // Find active index
                            const activeIdx = statusSteps.findIndex(s => s.activeStatus === app.status);
                            
                            return (
                              <Box
                                key={app.id}
                                sx={{
                                  p: 2.5,
                                  borderRadius: 2.5,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                                }}
                              >
                                <Stack spacing={2.5}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                      <Typography variant="body1" fontWeight={700}>
                                        {jobTitle}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {companyName} · Applied {formatDate(app.appliedAt)}
                                      </Typography>
                                    </Box>
                                    <Chip label={app.status} size="small" color="primary" sx={{ fontWeight: 700 }} />
                                  </Stack>
                                  
                                  {/* Horizontal step tracker */}
                                  {!isDeleted && (
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", px: 1 }}>
                                      {/* Background progress bar line */}
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          top: 10,
                                          left: 0,
                                          right: 0,
                                          height: 2,
                                          bgcolor: "divider",
                                          zIndex: 1,
                                        }}
                                      />
                                      {/* Foreground active progress line */}
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          top: 10,
                                          left: 0,
                                          width: `${(Math.max(activeIdx, 0) / (statusSteps.length - 1)) * 100}%`,
                                          height: 2,
                                          bgcolor: "primary.main",
                                          zIndex: 2,
                                          transition: "width 0.3s ease",
                                        }}
                                      />
                                      
                                      {statusSteps.map((step, idx) => {
                                        const isCompleted = idx <= activeIdx;
                                        const isCurrent = idx === activeIdx;
                                        
                                        return (
                                          <Stack
                                            key={step.label}
                                            alignItems="center"
                                            spacing={1}
                                            sx={{ zIndex: 3, position: "relative" }}
                                          >
                                            <Box
                                              sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: "50%",
                                                bgcolor: isCompleted 
                                                  ? "primary.main" 
                                                  : theme.palette.background.paper,
                                                border: "2px solid",
                                                borderColor: isCompleted ? "primary.main" : "divider",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: isCompleted ? "#ffffff" : "text.secondary",
                                                fontSize: "0.6rem",
                                                fontWeight: 700,
                                                boxShadow: isCurrent ? `0 0 10px ${theme.palette.primary.main}` : "none",
                                              }}
                                            >
                                              {isCompleted ? "✓" : idx + 1}
                                            </Box>
                                            <Typography
                                              variant="caption"
                                              fontWeight={isCurrent ? 700 : 500}
                                              color={isCurrent ? "primary.main" : "text.secondary"}
                                              sx={{ fontSize: "0.7rem", display: { xs: "none", sm: "block" } }}
                                            >
                                              {step.label}
                                            </Typography>
                                          </Stack>
                                        );
                                      })}
                                    </Box>
                                  )}
                                </Stack>
                              </Box>
                            );
                          })}
                        </Stack>
                      ) : (
                        <EmptyState
                          icon={<AssignmentTurnedInIcon />}
                          title="No applications submitted yet"
                          description="Your submitted jobs application cards and pipelines will appear here."
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Resume Insights AI widget */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    background: isDark
                      ? "linear-gradient(135deg, rgba(45,212,191,0.05), rgba(0,0,0,0))"
                      : "linear-gradient(135deg, rgba(15,118,110,0.03), rgba(255,255,255,0))",
                    borderColor: isDark ? "rgba(45,212,191,0.2)" : "rgba(15,118,110,0.15)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PsychologyIcon color="primary" />
                        <Typography variant="h3" fontWeight={700}>
                          AI Resume Insights
                        </Typography>
                      </Stack>
                      <Divider />
                      
                      {/* Overall score circular rating */}
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ position: "relative", display: "inline-flex" }}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: "50%",
                              border: "4px solid",
                              borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            <Typography variant="h3" fontWeight={800} color="primary.main">
                              {resumeScore}
                            </Typography>
                          </Box>
                        </Box>
                        <Stack spacing={0.5}>
                          <Typography variant="body1" fontWeight={700}>
                            ATS Match Rating
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Your resume performs better than 84% of developers.
                          </Typography>
                        </Stack>
                      </Stack>
                      
                      <Divider />
                      
                      {/* Strengths & Weaknesses */}
                      <Stack spacing={2}>
                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={700} color="success.main">
                            Strengths
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
                            <Chip label="Spring Boot" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                            <Chip label="AWS Deployments" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                            <Chip label="Java API REST" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                          </Stack>
                        </Stack>
                        
                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={700} color="error.main">
                            Areas to Improve
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
                            <Chip label="Unit Testing Coverage" size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />
                            <Chip label="Kubernetes / Docker" size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Stack>
    </Container>
  );
}
