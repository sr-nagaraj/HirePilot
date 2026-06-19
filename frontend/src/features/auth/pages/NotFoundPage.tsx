import HomeIcon from "@mui/icons-material/Home";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

export function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "calc(100vh - 65px)", display: "grid", placeItems: "center" }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <SearchOffIcon color="primary" sx={{ fontSize: 56 }} />
          <Typography variant="h2" component="h1">
            Page Not Found
          </Typography>
          <Typography color="text.secondary">
            The page you requested does not exist in HirePilot.
          </Typography>
          <Button component={Link} to={ROUTES.HOME} variant="contained" startIcon={<HomeIcon />}>
            Go Home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
