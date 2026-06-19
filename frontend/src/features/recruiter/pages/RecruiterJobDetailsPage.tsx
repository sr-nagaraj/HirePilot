import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import { Button, Card, CardContent, Chip, Container, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { getRecruiterApplicantsPath, getRecruiterEditJobPath } from "../../../shared/constants/routes";
import { formatCurrency, formatDate } from "../../../shared/utils/formatters";
import { useRecruiterJobApplicationsQuery, useRecruiterJobQuery } from "../hooks/recruiterJobHooks";

export function RecruiterJobDetailsPage() {
  const { jobId } = useParams();
  const { data: job, isLoading, isError } = useRecruiterJobQuery(jobId);
  const { data: applications = [] } = useRecruiterJobApplicationsQuery(jobId);

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {isLoading ? <Skeleton variant="rounded" height={420} /> : null}
        {isError ? <ErrorState message="Job details could not be loaded." /> : null}
        {!isLoading && !isError && !job ? (
          <EmptyState icon={<WorkIcon />} title="Job not found" description="This job may no longer be available." />
        ) : null}
        {job ? (
          <>
            <PageHeader
              title={job.title}
              subtitle={`Posted ${formatDate(job.createdAt)}`}
              actions={
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Button component={Link} to={getRecruiterEditJobPath(job.id)} variant="outlined">
                    Edit
                  </Button>
                  <Button
                    component={Link}
                    to={getRecruiterApplicantsPath(job.id)}
                    variant="contained"
                    startIcon={<PeopleIcon />}
                  >
                    Applicants
                  </Button>
                </Stack>
              }
            />
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={3}>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    <Chip icon={<BusinessIcon />} label={job.company ?? "Company unavailable"} />
                    <Chip icon={<LocationOnIcon />} label={job.location || "Location not specified"} />
                    <Chip icon={<WorkIcon />} label={`${job.experienceRequired ?? 0}+ years`} />
                    <Chip label={job.jobType || job.employmentType || "Employment type not specified"} />
                    <Chip label={formatCurrency(job.salary)} color="secondary" variant="outlined" />
                    <Chip label={`${applications.length} applications`} variant="outlined" />
                  </Stack>
                  <Divider />
                  <Stack spacing={1}>
                    <Typography variant="h4">Description</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                      {job.description || "No description provided."}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </>
        ) : null}
      </Stack>
    </Container>
  );
}
