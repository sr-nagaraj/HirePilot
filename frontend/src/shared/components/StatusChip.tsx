import { Chip, type ChipProps } from "@mui/material";
import type { ApplicationStatus } from "../../features/jobs/types/jobs";

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  REVIEWED: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview Scheduled",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SELECTED: "Selected",
  REJECTED: "Rejected",
  HIRED: "Selected",
};

const statusColors: Record<ApplicationStatus, ChipProps["color"]> = {
  APPLIED: "default",
  REVIEWED: "info",
  SHORTLISTED: "success",
  INTERVIEW: "secondary",
  INTERVIEW_SCHEDULED: "secondary",
  SELECTED: "success",
  REJECTED: "error",
  HIRED: "success",
};

interface StatusChipProps {
  status: ApplicationStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      label={statusLabels[status]}
      color={statusColors[status]}
      size="small"
      variant={status === "APPLIED" ? "outlined" : "filled"}
    />
  );
}

export function getApplicationStatusLabel(status: ApplicationStatus) {
  return statusLabels[status];
}
