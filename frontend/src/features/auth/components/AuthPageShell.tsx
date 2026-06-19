import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "calc(100vh - 65px)", display: "grid", alignItems: "center", py: 4 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}>
          <Stack spacing={0.75} sx={{ mb: 3 }}>
            <Typography variant="h2" component="h1">
              {title}
            </Typography>
            <Typography color="text.secondary">{subtitle}</Typography>
          </Stack>
          {children}
        </Paper>
      </Box>
    </Container>
  );
}
