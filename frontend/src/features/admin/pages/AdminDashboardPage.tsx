import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import WorkIcon from "@mui/icons-material/Work";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { useAuthStore } from "../../../app/store/authStore";
import { DashboardSkeleton } from "../../../shared/components/DashboardSkeleton";
import { MetricCard } from "../../../shared/components/MetricCard";
import { WelcomeCard } from "../../../shared/components/WelcomeCard";
import { useAdminDashboardQuery } from "../hooks/useAdminDashboardQuery";

const metricIcons: Record<string, ReactElement> = {
  totalUsers: <GroupsIcon />,
  candidates: <PersonSearchIcon />,
  recruiters: <BadgeIcon />,
  jobs: <WorkIcon />,
  applications: <AssignmentTurnedInIcon />,
};

export function AdminDashboardPage() {
  const email = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, isError } = useAdminDashboardQuery();

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <WelcomeCard
          title="Welcome to your Admin Workspace"
          email={email}
          role={role}
          token={token}
          showTokenStatus={false}
        />
        {isLoading ? <DashboardSkeleton actionCount={0} statCount={5} /> : null}
        {isError ? <Alert severity="error">Admin dashboard data could not be loaded.</Alert> : null}
        {data ? (
          <Stack spacing={1}>
            <Typography variant="h3" component="h2">
              Quick Stats
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(5, minmax(0, 1fr))",
                },
              }}
            >
              {data.metrics.map((metric) => (
                <MetricCard
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  helper={metric.helper}
                  icon={metricIcons[metric.key]}
                />
              ))}
            </Box>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
