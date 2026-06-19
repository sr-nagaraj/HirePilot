import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "../../app/providers/ThemeModeProvider";

export function ThemeModeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Use light mode" : "Use dark mode"}>
      <IconButton color="inherit" aria-label="toggle color mode" onClick={toggleMode}>
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
