import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { formatDate } from "../../../shared/utils/formatters";
import { useResumesQuery } from "../../resume/hooks/resumeHooks";
import { useApplyToJobMutation } from "../hooks/jobsHooks";
import type { Job } from "../types/jobs";

interface ApplyJobDialogProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function ApplyJobDialog({ job, open, onClose }: ApplyJobDialogProps) {
  const [resumeId, setResumeId] = useState<number | "">("");
  const { data: resumes = [], isLoading } = useResumesQuery();
  const applyMutation = useApplyToJobMutation();

  function handleApply() {
    if (!job || !resumeId) {
      return;
    }

    applyMutation.mutate(
      {
        jobId: job.id,
        resumeId,
      },
      {
        onSuccess: onClose,
      },
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply to {job?.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography color="text.secondary">
            Select the resume you want recruiters to review for this application.
          </Typography>
          {resumes.length ? (
            <Select
              value={resumeId}
              displayEmpty
              onChange={(event) => setResumeId(Number(event.target.value))}
            >
              <MenuItem value="" disabled>
                Choose resume
              </MenuItem>
              {resumes.map((resume) => (
                <MenuItem key={resume.id} value={resume.id}>
                  {resume.fileName} - uploaded {formatDate(resume.uploadedAt)}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Stack spacing={1}>
              <Typography fontWeight={700}>No resume is available.</Typography>
              <Button component={Link} to={ROUTES.CANDIDATE_RESUMES} onClick={onClose} variant="outlined">
                Go to Resume Center
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!resumeId || isLoading || applyMutation.isPending}
          onClick={handleApply}
        >
          {applyMutation.isPending ? "Applying..." : "Apply Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
