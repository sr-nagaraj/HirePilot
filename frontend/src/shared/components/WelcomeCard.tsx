import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { ROLE_LABELS } from "../constants/routes";
import type { AuthRole } from "../types/auth";

interface WelcomeCardProps {
  title: string;
  email: string | null;
  role: AuthRole | null;
  token: string | null;
  showTokenStatus?: boolean;
}

export function WelcomeCard({
  title,
  email,
  role,
  token,
  showTokenStatus = true,
}: WelcomeCardProps) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h2" component="h1">
            {title}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Chip label={email || "No email"} icon={<CheckCircleIcon />} />
            <Chip label={role ? ROLE_LABELS[role] : "No role"} color="primary" variant="outlined" />
            {showTokenStatus ? (
              <Chip
                label={token ? "JWT Active" : "No Token"}
                icon={<VpnKeyIcon />}
                color={token ? "success" : "warning"}
                variant={token ? "filled" : "outlined"}
              />
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
