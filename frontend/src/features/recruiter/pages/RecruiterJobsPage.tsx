import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
  Grid,
  alpha,
  useTheme,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import {
  getRecruiterApplicantsPath,
  getRecruiterCreateJobPath,
  getRecruiterEditJobPath,
  getRecruiterJobPath,
} from "../../../shared/constants/routes";
import { formatCurrency, formatDate } from "../../../shared/utils/formatters";
import { useRecruiterDashboard } from "../hooks/useRecruiterDashboard";
import { useDeleteRecruiterJobMutation } from "../hooks/recruiterJobHooks";
import type { RecentRecruiterJob } from "../types/recruiterDashboard";

export function RecruiterJobsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading, isError } = useRecruiterDashboard();
  const deleteJob = useDeleteRecruiterJobMutation();
  const [jobToDelete, setJobToDelete] = useState<RecentRecruiterJob | null>(null);
  const jobs = data?.jobsWithApplicationCounts ?? [];

  function handleConfirmDelete() {
    if (!jobToDelete) {
      return;
    }

    deleteJob.mutate(jobToDelete.id, {
      onSuccess: () => setJobToDelete(null),
    });
  }

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <PageHeader
          title="My Jobs"
          subtitle="Manage job posts, applicants, and hiring activity for your roles."
          actions={
            <Button component={Link} to={getRecruiterCreateJobPath()} variant="contained" startIcon={<AddIcon />}>
              Create Job
            </Button>
          }
        />
        
        {isLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((n) => (
              <Grid key={n} size={{ xs: 12, md: 6, lg: 4 }}>
                <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : null}
        
        {isError ? <ErrorState message="Recruiter jobs could not be loaded." /> : null}
        
        {!isLoading && !isError && jobs.length === 0 ? (
          <EmptyState icon={<WorkIcon />} title="No jobs posted" description="Create a job to start receiving applicants." />
        ) : null}
        
        {jobs.length ? (
          <Grid container spacing={3}>
            {jobs.map((job) => {
              const displayLocation = job.location || "Not specified";
              const formattedSalary = job.salary ? formatCurrency(job.salary) : "Not specified";
              const timePosted = job.createdAt ? formatDate(job.createdAt) : "Recently";
              
              return (
                <Grid key={job.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Card
                    variant="outlined"
                    className="hover-card"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      borderRadius: 3,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: isDark
                          ? "0 10px 30px rgba(0,0,0,0.4)"
                          : "0 10px 30px rgba(15,23,42,0.04)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Title & Status */}
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                          <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                            {job.title}
                          </Typography>
                          <Chip
                            label={job.status || "OPEN"}
                            size="small"
                            variant="outlined"
                            color={job.status === "CLOSED" ? "error" : "success"}
                            sx={{ fontWeight: 700, height: 22, fontSize: "0.7rem" }}
                          />
                        </Stack>
                      </Stack>
                      
                      {/* Job details list */}
                      <Stack spacing={1.5} sx={{ color: "text.secondary", mt: 1, flexGrow: 1 }}>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <LocationOnIcon sx={{ fontSize: 18, color: "primary.main" }} />
                          <Typography variant="body2">{displayLocation}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <PaymentsIcon sx={{ fontSize: 18, color: "primary.main" }} />
                          <Typography variant="body2">{formattedSalary} LPA</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <CalendarMonthIcon sx={{ fontSize: 18, color: "primary.main" }} />
                          <Typography variant="body2">Posted {timePosted}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <GroupIcon sx={{ fontSize: 18, color: "primary.main" }} />
                          <Typography variant="body2" fontWeight={700} color="text.primary">
                            {job.applicationCount} Applications
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                    
                    {/* Actions panel */}
                    <Box
                      sx={{
                        p: 2,
                        pt: 0,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 1,
                        bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={getRecruiterJobPath(job.id)}
                        startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                        sx={{ py: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={getRecruiterApplicantsPath(job.id)}
                        startIcon={<PeopleIcon sx={{ fontSize: 14 }} />}
                        sx={{ py: 1 }}
                      >
                        Applicants
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={getRecruiterEditJobPath(job.id)}
                        startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                        sx={{ py: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                        onClick={() => setJobToDelete(job)}
                        sx={{ py: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Stack>
      
      <Dialog open={Boolean(jobToDelete)} onClose={() => setJobToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete {jobToDelete?.title ?? "this job"}? This removes the job from your recruiter list.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setJobToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" disabled={deleteJob.isPending} onClick={handleConfirmDelete}>
            {deleteJob.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
