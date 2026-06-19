import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Tooltip, alpha, useTheme } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../app/store/authStore";
import { startGoogleOAuth } from "../features/auth/constants/oauth";
import { Logo } from "../shared/components/Logo";
import { ThemeModeToggle } from "../shared/components/ThemeModeToggle";
import { ROUTES } from "../shared/constants/routes";
import { getDashboardPath } from "../shared/utils/getDashboardPath";

const navItems = [
  { label: "Features", href: "/#features" },
  { label: "For Recruiters", href: "/#recruiters" },
  { label: "For Candidates", href: "/#candidates" },
  { label: "About", href: "/#about" },
];

export function PublicLayout() {
  const theme = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
          backdropFilter: "blur(18px)",
          bgcolor: alpha(theme.palette.background.paper, 0.86),
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: 70 }}>
          <Box component={Link} to={ROUTES.HOME} aria-label="HirePilot home">
            <Logo />
          </Box>
          <Stack
            component="nav"
            aria-label="Primary navigation"
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", lg: "flex" }, mx: "auto" }}
          >
            {navItems.map((item) => (
              <Button key={item.href} component="a" href={item.href} variant="text" color="inherit">
                {item.label}
              </Button>
            ))}
          </Stack>
          <Box sx={{ display: { xs: "block", md: "none" }, ml: "auto", flexShrink: 0 }}>
            <ThemeModeToggle />
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0, display: { xs: "none", lg: "none" } }} />
          <Box sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
            <ThemeModeToggle />
          </Box>
          {isAuthenticated ? (
            <>
              <Tooltip title="Dashboard">
                <IconButton
                  component={Link}
                  to={getDashboardPath(role)}
                  aria-label="open dashboard"
                  sx={{
                    display: { xs: "inline-flex", sm: "none" },
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: "8px",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <SpaceDashboardIcon />
                </IconButton>
              </Tooltip>
              <Button
                component={Link}
                to={getDashboardPath(role)}
                variant="contained"
                startIcon={<SpaceDashboardIcon />}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to={ROUTES.LOGIN}
                variant="text"
                startIcon={<LoginIcon />}
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to={ROUTES.REGISTER}
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  minWidth: { xs: 44, sm: "auto" },
                  px: { xs: 1.25, sm: 2 },
                  "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Register
                </Box>
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={startGoogleOAuth}
                sx={{ display: { xs: "none", xl: "inline-flex" } }}
              >
                Continue with Google
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
