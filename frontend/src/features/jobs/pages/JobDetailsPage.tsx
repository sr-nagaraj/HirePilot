import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import IosShareIcon from "@mui/icons-material/IosShare";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { formatCurrency, formatDate } from "../../../shared/utils/formatters";
import { useToast } from "../../../shared/hooks/useToast";
import { ApplyJobDialog } from "../components/ApplyJobDialog";
import { JobCard } from "../components/JobCard";
import { useJobDetailsQuery, useJobsQuery, useMyApplicationsQuery } from "../hooks/jobsHooks";

function Section({ title, body }: { title: string; body?: string }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h4">{title}</Typography>
      <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
        {body || "Not specified by recruiter."}
      </Typography>
    </Stack>
  );
}

export function JobDetailsPage() {
  const { jobId } = useParams();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();
  const { data: job, isLoading, isError } = useJobDetailsQuery(jobId);
  const { data: jobs = [] } = useJobsQuery();
  const { data: applications = [] } = useMyApplicationsQuery();
  const isApplied = applications.some((application) => application.jobId === job?.id);
  const similarJobs = useMemo(
    () =>
      jobs
        .filter(
          (candidate) =>
            candidate.id !== job?.id &&
            (candidate.company === job?.company ||
              candidate.location === job?.location ||
              candidate.jobType === job?.jobType),
        )
        .slice(0, 3),
    [job, jobs],
  );

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share && job) {
      await navigator.share({ title: job.title, text: `${job.title} at ${job.company}`, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    showToast("Job link copied.", "success");
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {isLoading ? <Skeleton variant="rounded" height={420} /> : null}
        {isError ? <ErrorState message="Job details could not be loaded." /> : null}
        {!isLoading && !isError && !job ? (
          <EmptyState
            icon={<WorkIcon />}
            title="Job not found"
            description="The requested job may be closed or unavailable."
          />
        ) : null}
        {job ? (
          <>
            <PageHeader
              title={job.title}
              subtitle={`${job.company} - Posted ${formatDate(job.createdAt)}`}
              actions={
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    onClick={() => setIsSaved((current) => !current)}
                  >
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                  <Button variant="outlined" startIcon={<IosShareIcon />} onClick={handleShare}>
                    Share Job
                  </Button>
                  <Button variant="contained" onClick={() => setIsApplyOpen(true)} disabled={isApplied}>
                    {isApplied ? "Applied" : "Apply Now"}
                  </Button>
                </Stack>
              }
            />
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={3}>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    <Chip icon={<BusinessIcon />} label={job.company} />
                    <Chip icon={<LocationOnIcon />} label={job.location || "Location not specified"} />
                    <Chip icon={<WorkIcon />} label={`${job.experienceRequired ?? 0}+ years`} />
                    <Chip label={job.jobType || "Employment type not specified"} />
                    <Chip label={formatCurrency(job.salary)} color="secondary" variant="outlined" />
                  </Stack>
                  <Divider />
                  <Section title="Description" body={job.description} />
                  <Section title="Requirements" body={job.requirements || job.skills} />
                  <Section title="Benefits" body={job.benefits} />
                </Stack>
              </CardContent>
            </Card>
            <Stack spacing={1.5}>
              <Typography variant="h3">Similar Jobs</Typography>
              {similarJobs.length ? (
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                  }}
                >
                  {similarJobs.map((similarJob) => (
                    <JobCard key={similarJob.id} job={similarJob} />
                  ))}
                </Box>
              ) : (
                <EmptyState
                  icon={<WorkIcon />}
                  title="No similar jobs yet"
                  description="Similar openings will appear when matching jobs are available."
                />
              )}
            </Stack>
          </>
        ) : null}
      </Stack>
      <ApplyJobDialog job={job ?? null} open={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
    </Container>
  );
}
