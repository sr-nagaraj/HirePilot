import { Box, Typography } from "@mui/material";
import { APP_NAME } from "../constants/app";

export function Logo() {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Box component="img" src="/assets/hirepilot-logo.png" alt="" sx={{ width: 34, height: 34 }} />
      <Typography variant="h4" component="span" sx={{ fontWeight: 800 }}>
        {APP_NAME}
      </Typography>
    </Box>
  );
}
