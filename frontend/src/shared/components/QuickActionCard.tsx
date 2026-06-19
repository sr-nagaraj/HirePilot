import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface QuickActionCardProps {
  label: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}

export function QuickActionCard({ label, description, icon, onClick }: QuickActionCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%", minHeight: 145 }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={1.25}>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 38,
                height: 38,
                borderRadius: "8px",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              {icon}
            </Stack>
            <Typography variant="h4" component="h2">
              {label}
            </Typography>
            <Typography color="text.secondary">{description}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
