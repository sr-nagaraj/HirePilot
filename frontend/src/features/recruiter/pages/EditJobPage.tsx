import WorkIcon from "@mui/icons-material/Work";
import { Container, Skeleton, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { getRecruiterJobPath } from "../../../shared/constants/routes";
import { RecruiterJobForm } from "../components/RecruiterJobForm";
import { useRecruiterJobQuery, useUpdateRecruiterJobMutation } from "../hooks/recruiterJobHooks";
import type { RecruiterJobPayload } from "../types/recruiterDashboard";

export function EditJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useRecruiterJobQuery(jobId);
  const updateJob = useUpdateRecruiterJobMutation(jobId);

  function handleSubmit(payload: RecruiterJobPayload) {
    updateJob.mutate(payload, {
      onSuccess: (updatedJob) => navigate(getRecruiterJobPath(updatedJob.id)),
    });
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <PageHeader title="Edit Job" subtitle="Update role details and keep candidate expectations accurate." />
        {isLoading ? <Skeleton variant="rounded" height={520} /> : null}
        {isError ? <ErrorState message="Job could not be loaded." /> : null}
        {!isLoading && !isError && !job ? (
          <EmptyState icon={<WorkIcon />} title="Job not found" description="This job may no longer be available." />
        ) : null}
        {job ? (
          <RecruiterJobForm
            job={job}
            submitLabel="Save Changes"
            isSubmitting={updateJob.isPending}
            onSubmit={handleSubmit}
          />
        ) : null}
      </Stack>
    </Container>
  );
}
