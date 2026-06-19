import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("HirePilot UI error", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <Container maxWidth="sm">
          <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <Alert severity="error" sx={{ width: "100%" }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Something went wrong
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                The HirePilot interface hit an unexpected issue.
              </Typography>
              <Button
                startIcon={<RefreshIcon />}
                variant="contained"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            </Alert>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
