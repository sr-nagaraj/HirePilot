import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Chip,
  Skeleton,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusChip } from "../../../shared/components/StatusChip";
import { formatDate, formatCurrency } from "../../../shared/utils/formatters";
import { ApplicationTimeline } from "../components/ApplicationTimeline";
import { useJobsQuery, useMyApplicationsQuery } from "../../jobs/hooks/jobsHooks";
import type { EnrichedApplication } from "../../jobs/types/jobs";
import { getJobDetailsPath } from "../../../shared/constants/routes";

export function ApplicationsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: applications = [], isLoading, isError } = useMyApplicationsQuery();
  const { data: jobs = [] } = useJobsQuery();

  const rows = useMemo<EnrichedApplication[]>(
    () =>
      applications.map((application) => {
        const job = jobs.find((j) => j.id === application.jobId);
        const isDeleted = application.jobDeleted || job?.deleted;
        return {
          ...application,
          job,
          jobTitle: isDeleted ? "🚫 Job Deleted By Recruiter" : (job?.title ?? application.jobTitle),
          companyName: isDeleted ? "This position is no longer available." : (job?.company ?? application.companyName),
        };
      }),
    [applications, jobs],
  );

  // Apply search and status filters
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        (row.jobTitle ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.companyName ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const isDeleted = row.jobDeleted || row.job?.deleted;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "CLOSED" && isDeleted) ||
        (!isDeleted && row.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [rows, searchQuery, statusFilter]);

  // Auto-select first application when the list loads or changes
  useEffect(() => {
    if (filteredRows.length > 0) {
      if (selectedId === null || !filteredRows.some((row) => row.id === selectedId)) {
        setSelectedId(filteredRows[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredRows, selectedId]);

  const selectedApplication = useMemo(
    () => filteredRows.find((application) => application.id === selectedId) ?? null,
    [filteredRows, selectedId],
  );

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <PageHeader
          title="Application Tracking"
          subtitle="Track every application from applied through review, shortlist, interview, and selection."
        />

        {isLoading ? (
          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1.8fr" } }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" height={500} sx={{ borderRadius: 3 }} />
          </Box>
        ) : null}

        {isError ? <ErrorState message="Applications could not be loaded." /> : null}

        {!isLoading && !isError && rows.length === 0 ? (
          <EmptyState
            icon={<AssignmentTurnedInIcon />}
            title="No applications yet"
            description="Applications will appear here after you apply to jobs."
          />
        ) : null}

        {!isLoading && !isError && rows.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.2fr) minmax(0, 1.8fr)" },
              alignItems: "start",
            }}
          >
            {/* Left Panel: Search & Filter and List */}
            <Stack spacing={2.5}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      placeholder="Search jobs or companies..."
                      size="small"
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                      <InputLabel id="status-filter-label">Status</InputLabel>
                      <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="ALL">All Statuses</MenuItem>
                        <MenuItem value="APPLIED">Applied</MenuItem>
                        <MenuItem value="REVIEWED">Reviewed</MenuItem>
                        <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                        <MenuItem value="INTERVIEW_SCHEDULED">Interview</MenuItem>
                        <MenuItem value="HIRED">Selected</MenuItem>
                        <MenuItem value="CLOSED">Closed/Deleted</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>

              {filteredRows.length === 0 ? (
                <Card variant="outlined" sx={{ borderRadius: 3, py: 4, textAlign: "center" }}>
                  <CardContent>
                    <Stack spacing={1.5} alignItems="center">
                      <ErrorOutlineIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                      <Typography variant="h4" fontWeight={700}>
                        No matching applications
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search query or status filter.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Stack spacing={1.5} sx={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", pr: 0.5 }}>
                  {filteredRows.map((app) => {
                    const isSelected = app.id === selectedId;
                    const isDeleted = app.jobDeleted || app.job?.deleted;

                    return (
                      <Card
                        key={app.id}
                        variant="outlined"
                        onClick={() => setSelectedId(app.id)}
                        sx={{
                          cursor: "pointer",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: isSelected
                            ? isDark
                              ? alpha(theme.palette.primary.main, 0.08)
                              : alpha(theme.palette.primary.main, 0.04)
                            : "background.paper",
                          position: "relative",
                          transition: "all 0.22s ease",
                          "&:hover": {
                            borderColor: isSelected ? "primary.main" : "text.secondary",
                            bgcolor: isSelected ? undefined : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 4,
                              bgcolor: "primary.main",
                            }}
                          />
                        )}
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h4" fontWeight={700} noWrap>
                                  {app.jobTitle}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap sx={{ mt: 0.25 }}>
                                  {app.companyName}
                                </Typography>
                              </Box>
                              {isDeleted ? (
                                <Chip label="CLOSED" color="error" size="small" sx={{ fontWeight: 700, height: 22 }} />
                              ) : (
                                <StatusChip status={app.status} />
                              )}
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">Applied {formatDate(app.appliedAt)}</Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Stack>

            {/* Right Panel: Detailed Timeline */}
            {selectedApplication ? (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  position: "sticky",
                  top: 24,
                  background: isDark
                    ? "linear-gradient(180deg, rgba(45,212,191,0.02) 0%, rgba(24,24,27,0) 100%)"
                    : "linear-gradient(180deg, rgba(15,118,110,0.01) 0%, rgba(255,255,255,0) 100%)",
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack spacing={3.5}>
                    {/* Header */}
                    <Stack spacing={2.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h2" sx={{ fontWeight: 800 }}>
                            {selectedApplication.jobTitle}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                            {selectedApplication.companyName}
                          </Typography>
                        </Box>
                        {!selectedApplication.jobDeleted && !selectedApplication.job?.deleted && (
                          <Button
                            component={Link}
                            to={getJobDetailsPath(selectedApplication.jobId)}
                            variant="contained"
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                          >
                            View Job
                          </Button>
                        )}
                      </Stack>

                      {/* Job metadata if available */}
                      {!selectedApplication.jobDeleted && selectedApplication.job && (
                        <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap" sx={{ color: "text.secondary" }}>
                          {selectedApplication.job.location && (
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <LocationOnIcon sx={{ fontSize: 18, color: "primary.main" }} />
                              <Typography variant="body2">{selectedApplication.job.location}</Typography>
                            </Stack>
                          )}
                          {selectedApplication.job.salary !== undefined && selectedApplication.job.salary !== null && (
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <PaymentsIcon sx={{ fontSize: 18, color: "primary.main" }} />
                              <Typography variant="body2">{formatCurrency(selectedApplication.job.salary)} LPA</Typography>
                            </Stack>
                          )}
                        </Stack>
                      )}
                    </Stack>

                    <Divider />

                    {/* Timeline section */}
                    <Stack spacing={2}>
                      <Typography variant="h3" fontWeight={700}>
                        Application Status Pipeline
                      </Typography>
                      
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                        }}
                      >
                        <ApplicationTimeline status={selectedApplication.status} />
                      </Box>
                    </Stack>

                    {/* Helper information/insights */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        borderColor: isDark ? "rgba(45,212,191,0.2)" : "rgba(15,118,110,0.15)",
                        bgcolor: isDark ? "rgba(45,212,191,0.02)" : "rgba(15,118,110,0.02)",
                      }}
                    >
                      <Typography variant="body2" fontWeight={700} color="primary.main" gutterBottom>
                        What's Next?
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
                        {selectedApplication.status === "APPLIED" &&
                          "Your application has been received. The hiring team will review your resume and skills match shortly."}
                        {selectedApplication.status === "REVIEWED" &&
                          "The hiring manager has reviewed your resume. They are evaluating your background for a potential fit."}
                        {selectedApplication.status === "SHORTLISTED" &&
                          "Excellent! You have been shortlisted for this role. Expect a coordinator to reach out for interview scheduling."}
                        {selectedApplication.status === "INTERVIEW_SCHEDULED" &&
                          "Your interview is scheduled. Get ready to meet the team and talk about your skills and experience!"}
                        {selectedApplication.status === "HIRED" &&
                          "Congratulations! You have been selected for this position. The team will be in touch with offer details soon."}
                        {selectedApplication.status === "REJECTED" &&
                          "Thank you for your application. Although this position is closed or we moved forward with another candidate, your profile remains in our talent network for future openings."}
                      </Typography>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            ) : null}
          </Box>
        ) : null}
      </Stack>
    </Container>
  );
}
