import { Box, CircularProgress } from "@mui/material";

export function PageLoader() {
  return (
    <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}
