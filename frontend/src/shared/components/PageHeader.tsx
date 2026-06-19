import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
    >
      <Stack spacing={0.75}>
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
          {subtitle}
        </Typography>
      </Stack>
      {actions}
    </Stack>
  );
}
