import { Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../shared/components/PageHeader";
import { getRecruiterJobsPath } from "../../../shared/constants/routes";
import { RecruiterJobForm } from "../components/RecruiterJobForm";
import { useCreateRecruiterJobMutation } from "../hooks/recruiterJobHooks";
import type { RecruiterJobPayload } from "../types/recruiterDashboard";

export function CreateJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateRecruiterJobMutation();

  function handleSubmit(payload: RecruiterJobPayload) {
    createJob.mutate(payload, {
      onSuccess: () => navigate(getRecruiterJobsPath()),
    });
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <PageHeader title="Create Job" subtitle="Publish a new role for candidates to discover and apply." />
        <RecruiterJobForm submitLabel="Create Job" isSubmitting={createJob.isPending} onSubmit={handleSubmit} />
      </Stack>
    </Container>
  );
}
