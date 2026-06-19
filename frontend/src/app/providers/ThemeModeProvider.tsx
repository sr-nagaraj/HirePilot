import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { CssBaseline, ThemeProvider, alpha, createTheme } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const THEME_STORAGE_KEY = "hirepilot.theme";

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function buildTheme(mode: ThemeMode) {
  const isDark = mode === "dark";
  const pageBackground = isDark ? "#09090b" : "#f8fafc";
  const paperBackground = isDark ? "#18181b" : "#ffffff";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#2dd4bf" : "#0f766e",
        light: isDark ? "#5eead4" : "#2ca99b",
        dark: isDark ? "#115e59" : "#0b504c",
        contrastText: isDark ? "#0f172a" : "#ffffff",
      },
      secondary: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#b45309",
        contrastText: "#ffffff",
      },
      background: {
        default: pageBackground,
        paper: paperBackground,
      },
      text: {
        primary: isDark ? "#f8fafc" : "#0f172a",
        secondary: isDark ? "#94a3b8" : "#475569",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily:
        'Inter, "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
      h1: {
        fontSize: "2.5rem",
        lineHeight: 1.15,
        fontWeight: 800,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: "1.875rem",
        lineHeight: 1.2,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontSize: "1.25rem",
        lineHeight: 1.3,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      h4: {
        fontSize: "1.1rem",
        lineHeight: 1.35,
        fontWeight: 600,
        letterSpacing: 0,
      },
      body1: {
        fontSize: "0.95rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        letterSpacing: 0,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: "none",
            boxShadow: isDark
              ? "0 4px 20px 0 rgba(0, 0, 0, 0.4)"
              : "0 4px 20px 0 rgba(0, 0, 0, 0.02)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(15, 23, 42, 0.06)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((current) => {
          const next = current === "dark" ? "light" : "dark";
          window.localStorage.setItem(THEME_STORAGE_KEY, next);
          return next;
        }),
    }),
    [mode],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const value = useContext(ThemeModeContext);

  if (!value) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }

  return value;
}
