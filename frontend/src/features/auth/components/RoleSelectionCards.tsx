import BadgeIcon from "@mui/icons-material/Badge";
import WorkIcon from "@mui/icons-material/Work";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import type { RegisterFormValues } from "../schemas/authSchemas";

interface RoleSelectionCardsProps {
  value: RegisterFormValues["role"];
  error?: string;
  onChange: (role: RegisterFormValues["role"]) => void;
}

const roles = [
  {
    value: "CANDIDATE" as const,
    label: "Candidate",
    description: "Apply for jobs and manage applications",
    icon: <BadgeIcon />,
  },
  {
    value: "RECRUITER" as const,
    label: "Recruiter",
    description: "Post jobs and hire talent",
    icon: <WorkIcon />,
  },
];

export function RoleSelectionCards({ value, error, onChange }: RoleSelectionCardsProps) {
  return (
    <Box>
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        {roles.map((role) => {
          const selected = role.value === value;

          return (
            <Card
              key={role.value}
              variant="outlined"
              sx={{
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "action.selected" : "background.paper",
              }}
            >
              <CardActionArea onClick={() => onChange(role.value)} sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "8px",
                        bgcolor: selected ? "primary.main" : "action.hover",
                        color: selected ? "primary.contrastText" : "text.primary",
                      }}
                    >
                      {role.icon}
                    </Box>
                    <Typography variant="h4" component="h2">
                      {role.label}
                    </Typography>
                    <Typography color="text.secondary">{role.description}</Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
      {error ? <FormHelperText error>{error}</FormHelperText> : null}
    </Box>
  );
}
