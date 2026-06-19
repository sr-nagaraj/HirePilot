import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link, useRouteError } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export function RouteErrorPage() {
  const error = useRouteError();
  const message =
    error instanceof Error ? error.message : "The requested route could not be rendered.";

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <Box>
          <ReportProblemIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h2" component="h1" gutterBottom>
            Route unavailable
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {message}
          </Typography>
          <Button component={Link} to={ROUTES.HOME} variant="contained">
            Go home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
