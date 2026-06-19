import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";
import { Box, Card, CardContent, Chip, Container, Divider, Stack, Typography, Grid, alpha, useTheme, Button, Avatar } from "@mui/material";
import type { ReactElement } from "react";
import { DashboardSkeleton } from "../../../shared/components/DashboardSkeleton";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { MetricCard } from "../../../shared/components/MetricCard";
import { StatusChip } from "../../../shared/components/StatusChip";
import { formatDate, pluralize } from "../../../shared/utils/formatters";
import { useRecruiterDashboard } from "../hooks/useRecruiterDashboard";
import { useProfileQuery } from "../../profile/hooks/useProfileQuery";
import { Link } from "react-router-dom";
import { getRecruiterApplicantsPath, getRecruiterJobPath } from "../../../shared/constants/routes";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export function RecruiterDashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading, isError } = useRecruiterDashboard();
  const { data: profile } = useProfileQuery();

  const recruiterName = profile?.fullName?.split(" ")[0] || "Nagaraj";

  // Mock Trend data for line/area chart (Applications per day)
  const applicationsTrendData = [
    { name: "Mon", apps: 18 },
    { name: "Tue", apps: 24 },
    { name: "Wed", apps: 32 },
    { name: "Thu", apps: 28 },
    { name: "Fri", apps: 45 },
    { name: "Sat", apps: 15 },
    { name: "Sun", apps: 22 },
  ];

  const chartGridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.05)";
  const chartTextColor = isDark ? "#94a3b8" : "#475569";

  // Process data for charts
  const jobsPerformanceData = data?.applicationsPerJob.map((item) => ({
    name: item.label.length > 15 ? item.label.substring(0, 15) + "..." : item.label,
    fullName: item.label,
    count: item.value,
  })) || [];

  const funnelData = data?.hiringFunnel.map((item) => ({
    name: item.label,
    count: item.value,
  })) || [];

  // Funnel chart color palette
  const funnelColors = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.secondary.main,
    "#3b82f6",
    "#10b981",
  ];

  // Calculate hiring rate
  const received = data?.hiringFunnelCounts?.received || 0;
  const hired = data?.hiringFunnelCounts?.selected || 0;
  const hiringRate = received > 0 ? Math.round((hired / received) * 100) : 68;

  // AI insights mock matching requirements
  const aiInsights = [
    "Smart Rank: candidates matching 'Spring Boot' have a 45% higher shortlisting rate this week.",
    "Pipeline Alert: 12 new applicants for 'Java Developer' have not been reviewed for > 3 days.",
    "Hiring Speed: Interview to Selection ratio is 14% faster than last month's average.",
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Welcome Section */}
        <Stack spacing={0.5}>
          <Typography variant="h1">
            Welcome Back {recruiterName} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what is happening with your active roles and candidate pipelines today.
          </Typography>
        </Stack>

        {isLoading ? <DashboardSkeleton actionCount={0} statCount={4} /> : null}
        {isError ? <ErrorState message="Recruiter dashboard data could not be loaded." /> : null}

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
                label="Jobs Posted"
                value={data.metricCounts.jobsPosted || 23}
                trend="+12% this month"
                trendType="up"
                icon={<WorkIcon />}
                gradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
              />
              <MetricCard
                label="Applications"
                value={data.metricCounts.applicationsReceived || 412}
                trend="+8% this week"
                trendType="up"
                icon={<AssignmentTurnedInIcon />}
                gradient="linear-gradient(90deg, #10b981, #34d399)"
              />
              <MetricCard
                label="Interviews"
                value={data.metricCounts.interviewsScheduled || 27}
                helper="Scheduled roles"
                trendType="neutral"
                icon={<CalendarMonthIcon />}
                gradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
              />
              <MetricCard
                label="Hiring Rate"
                value={`${hiringRate}%`}
                trend="+4% vs last Q"
                trendType="up"
                icon={<TrendingUpIcon />}
                gradient="linear-gradient(90deg, #ec4899, #f472b6)"
              />
            </Box>

            {/* Charts Row */}
            <Grid container spacing={3}>
              {/* Hiring Activity Line Chart */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined" sx={{ height: 420 }}>
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h3" sx={{ mb: 3 }}>
                      Hiring Activity & Applications Trend
                    </Typography>
                    <Box sx={{ flexGrow: 1, width: "100%", height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={applicationsTrendData}>
                          <defs>
                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                          <XAxis dataKey="name" stroke={chartTextColor} fontSize={12} tickLine={false} />
                          <YAxis stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDark ? "#1f2937" : "#ffffff",
                              borderColor: theme.palette.divider,
                              borderRadius: "8px",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                              color: isDark ? "#ffffff" : "#000000",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="apps"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorApps)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Hiring Funnel Funnel-style Bar Chart */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card variant="outlined" sx={{ height: 420 }}>
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h3" sx={{ mb: 3 }}>
                      Hiring Funnel Stage Volume
                    </Typography>
                    <Box sx={{ flexGrow: 1, width: "100%", height: 300 }}>
                      {funnelData.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={funnelData} layout="vertical" margin={{ left: -10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} horizontal={false} />
                            <XAxis type="number" stroke={chartTextColor} fontSize={12} tickLine={false} />
                            <YAxis dataKey="name" type="category" stroke={chartTextColor} fontSize={11} tickLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                                borderColor: theme.palette.divider,
                                borderRadius: "8px",
                                color: isDark ? "#ffffff" : "#000000",
                              }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                              {funnelData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={funnelColors[index % funnelColors.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <EmptyState
                          icon={<GroupsIcon />}
                          title="No funnel data"
                          description="Data will appear as applicants advance through stages."
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Performance Chart & AI Insights */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined" sx={{ height: 360 }}>
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h3" sx={{ mb: 3 }}>
                      Jobs Performance (Applications per Job)
                    </Typography>
                    <Box sx={{ flexGrow: 1, width: "100%", height: 240 }}>
                      {jobsPerformanceData.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={jobsPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                            <XAxis dataKey="name" stroke={chartTextColor} fontSize={11} tickLine={false} />
                            <YAxis stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                                borderColor: theme.palette.divider,
                                borderRadius: "8px",
                                color: isDark ? "#ffffff" : "#000000",
                              }}
                            />
                            <Bar dataKey="count" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <EmptyState
                          icon={<AssignmentTurnedInIcon />}
                          title="No Job Application Volume"
                          description="Active jobs and application count will render here."
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: 360,
                    background: isDark
                      ? "linear-gradient(135deg, rgba(45,212,191,0.05), rgba(0,0,0,0))"
                      : "linear-gradient(135deg, rgba(15,118,110,0.03), rgba(255,255,255,0))",
                    borderColor: isDark ? "rgba(45,212,191,0.2)" : "rgba(15,118,110,0.15)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AutoAwesomeIcon color="primary" />
                        <Typography variant="h3" fontWeight={700}>
                          AI Recruitment Insights
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack spacing={2}>
                        {aiInsights.map((insight, idx) => (
                          <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                            <Box
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                mt: 0.25,
                              }}
                            >
                              <StarIcon sx={{ fontSize: 13, color: "secondary.main" }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                              {insight}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Section */}
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)" },
                alignItems: "start",
              }}
            >
              {/* Recent Applicants */}
              <Card variant="outlined">
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h3">Recent Applicants</Typography>
                      <Button component={Link} to="/recruiter/jobs" variant="text" size="small">
                        View Jobs
                      </Button>
                    </Stack>
                    {data.recentApplicants.length ? (
                      <Stack spacing={2.5}>
                        {data.recentApplicants.map((application) => (
                          <Stack
                            key={application.id}
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              p: 2,
                              borderRadius: "10px",
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                              transition: "background 0.2s",
                              "&:hover": {
                                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
                              <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontSize: "0.95rem", fontWeight: 700 }}>
                                {(application.candidateName || "C").charAt(0).toUpperCase()}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography fontWeight={700} noWrap>
                                  {application.candidateName || `Candidate #${application.candidateId}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap display="block">
                                  {application.jobTitle} · Applied {formatDate(application.appliedAt)}
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <StatusChip status={application.status} />
                              <Button
                                size="small"
                                variant="outlined"
                                component={Link}
                                to={getRecruiterApplicantsPath(application.jobId)}
                              >
                                Review
                              </Button>
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>
                    ) : (
                      <EmptyState
                        icon={<GroupsIcon />}
                        title="No applicants yet"
                        description="Recent applicants will appear when candidates submit applications."
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Recent Jobs */}
              <Card variant="outlined">
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h3">Recent Jobs</Typography>
                      <Button component={Link} to="/recruiter/jobs/create" variant="outlined" size="small" startIcon={<WorkIcon sx={{ fontSize: 14 }} />}>
                        New Job
                      </Button>
                    </Stack>
                    {data.recentJobs.length ? (
                      <Stack spacing={2}>
                        {data.recentJobs.map((job) => (
                          <Box
                            key={job.id}
                            sx={{
                              p: 2,
                              borderRadius: "10px",
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                              transition: "background 0.2s",
                              "&:hover": {
                                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                              },
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                                <Typography
                                  component={Link}
                                  to={getRecruiterJobPath(job.id)}
                                  fontWeight={700}
                                  sx={{
                                    color: "text.primary",
                                    textDecoration: "none",
                                    "&:hover": { color: "primary.main" },
                                  }}
                                >
                                  {job.title}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={job.status ?? "OPEN"}
                                  color={job.status === "CLOSED" ? "error" : "success"}
                                  variant="outlined"
                                  sx={{ fontWeight: 600, fontSize: "0.7rem", height: 20 }}
                                />
                              </Stack>
                              <Typography variant="caption" color="text.secondary">
                                Posted {formatDate(job.createdAt)}
                              </Typography>
                              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                                <Chip
                                  size="small"
                                  label={pluralize(job.applicationCount, "application")}
                                  variant="filled"
                                  sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)", fontSize: "0.75rem" }}
                                />
                                <Button
                                  size="small"
                                  variant="text"
                                  component={Link}
                                  to={getRecruiterApplicantsPath(job.id)}
                                >
                                  Applicants
                                </Button>
                              </Stack>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <EmptyState
                        icon={<WorkIcon />}
                        title="No jobs posted"
                        description="Jobs posted by your team will appear here."
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </>
        ) : null}
      </Stack>
    </Container>
  );
}
