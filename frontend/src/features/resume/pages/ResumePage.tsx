import DescriptionIcon from "@mui/icons-material/Description";
import { Box, Container, Skeleton, Stack } from "@mui/material";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { ResumeCard } from "../components/ResumeCard";
import { ResumeUploader } from "../components/ResumeUploader";
import { useDeleteResumeMutation, useResumesQuery } from "../hooks/resumeHooks";

export function ResumePage() {
  const { data: resumes = [], isLoading, isError } = useResumesQuery();
  const deleteMutation = useDeleteResumeMutation();

  function handleDelete(resumeId: number) {
    if (window.confirm("Delete this resume?")) {
      deleteMutation.mutate(resumeId);
    }
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <PageHeader
          title="Resume Center"
          subtitle="Upload, replace, preview, download, and manage resumes used for job applications."
        />
        <ResumeUploader />

        {isLoading ? <Skeleton variant="rounded" height={220} /> : null}
        {isError ? <ErrorState message="Resumes could not be loaded." /> : null}
        {!isLoading && !isError && resumes.length === 0 ? (
          <EmptyState
            icon={<DescriptionIcon />}
            title="No resumes uploaded"
            description="Upload a PDF, DOC, or DOCX resume before applying to jobs."
          />
        ) : null}
        {resumes.length ? (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            }}
          >
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={handleDelete} />
            ))}
          </Box>
        ) : null}
      </Stack>
    </Container>
  );
}
