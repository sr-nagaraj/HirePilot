import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 44,
              height: 44,
              borderRadius: "8px",
              bgcolor: "action.hover",
              color: "primary.main",
            }}
          >
            {icon}
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="h4">{title}</Typography>
            <Typography color="text.secondary">{description}</Typography>
          </Stack>
          {action}
        </Stack>
      </CardContent>
    </Card>
  );
}
