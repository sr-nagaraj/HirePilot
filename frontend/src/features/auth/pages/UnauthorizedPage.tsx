import BlockIcon from "@mui/icons-material/Block";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../app/store/authStore";
import { ROUTES } from "../../../shared/constants/routes";
import { getDashboardPath } from "../../../shared/utils/getDashboardPath";

export function UnauthorizedPage() {
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "calc(100vh - 65px)", display: "grid", placeItems: "center" }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <BlockIcon color="error" sx={{ fontSize: 56 }} />
          <Typography variant="h2" component="h1">
            Unauthorized
          </Typography>
          <Typography color="text.secondary">
            This workspace is not available for your current role.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button component={Link} to={ROUTES.HOME} variant="outlined" startIcon={<HomeIcon />}>
              Home
            </Button>
            <Button
              component={Link}
              to={isAuthenticated ? getDashboardPath(role) : ROUTES.LOGIN}
              variant="contained"
              startIcon={<LoginIcon />}
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
