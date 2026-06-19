import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { getApplicationStatusLabel } from "../../../shared/components/StatusChip";
import type { ApplicationStatus } from "../../jobs/types/jobs";

const statusOrder: ApplicationStatus[] = [
  "APPLIED",
  "REVIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "HIRED",
];

interface ApplicationTimelineProps {
  status: ApplicationStatus;
}

export function ApplicationTimeline({ status }: ApplicationTimelineProps) {
  const theme = useTheme();
  const rejected = status === "REJECTED";
  const activeIndex = rejected ? 1 : statusOrder.indexOf(status);
  const timeline = rejected ? ["APPLIED", "REVIEWED", "REJECTED"] : statusOrder;

  return (
    <Stack spacing={1.5}>
      {timeline.map((step, index) => {
        const stepStatus = step as ApplicationStatus;
        const isComplete = index <= activeIndex;
        const isCurrent = stepStatus === status;

        return (
          <Stack key={step} direction="row" spacing={1.5} alignItems="flex-start">
            <Stack alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  color: isComplete
                    ? stepStatus === "REJECTED"
                      ? "error.main"
                      : "primary.main"
                    : "text.disabled",
                  display: "flex",
                }}
              >
                {isComplete ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
              </Box>
              {index < timeline.length - 1 ? (
                <Box
                  sx={{
                    width: 2,
                    height: 24,
                    bgcolor: isComplete ? theme.palette.primary.main : theme.palette.divider,
                  }}
                />
              ) : null}
            </Stack>
            <Stack spacing={0.25}>
              <Typography fontWeight={isCurrent ? 800 : 600}>
                {getApplicationStatusLabel(stepStatus)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isCurrent ? "Current status" : isComplete ? "Completed" : "Pending"}
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
