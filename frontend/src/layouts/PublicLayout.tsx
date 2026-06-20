import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

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
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 70, px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box component={Link} to={ROUTES.HOME} aria-label="HirePilot home" sx={{ display: "flex", alignItems: "center" }}>
              <Logo />
            </Box>
          </Stack>

          {/* Desktop Navigation Links */}
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

          {/* Action Buttons & Menu Controls */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Theme Toggle always visible on desktop, hidden on very small screens since it will be in drawer */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ThemeModeToggle />
            </Box>

            {/* Authenticated State */}
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
                {/* Desktop and Tablet Auth actions */}
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
                    px: 2,
                  }}
                >
                  Register
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

            {/* Mobile/Tablet Drawer Toggle Button */}
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "inline-flex", lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer for Mobile & Tablet */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: "background.default",
            p: 3,
            boxShadow: `0 24px 64px ${alpha("#000", 0.15)}`,
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Stack spacing={3} sx={{ height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Logo />
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Theme toggle also available inside mobile drawer */}
              <ThemeModeToggle />
              <IconButton onClick={handleDrawerToggle} aria-label="close navigation menu">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Divider />

          {/* Navigation Links */}
          <List disablePadding>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: "8px",
                    color: "text.primary",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider />

          {/* Action CTAs in Mobile Drawer */}
          <Stack spacing={1.5} sx={{ pb: 2 }}>
            {isAuthenticated ? (
              <Button
                component={Link}
                to={getDashboardPath(role)}
                variant="contained"
                startIcon={<SpaceDashboardIcon />}
                onClick={handleDrawerToggle}
                fullWidth
                size="large"
                sx={{ borderRadius: "100px" }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to={ROUTES.LOGIN}
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={handleDrawerToggle}
                  fullWidth
                  size="large"
                  sx={{ borderRadius: "100px" }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to={ROUTES.REGISTER}
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleDrawerToggle}
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: "100px",
                    bgcolor: theme.palette.mode === "dark" ? "primary.main" : "primary.dark",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" ? "primary.light" : "primary.main",
                    },
                  }}
                >
                  Register
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => {
                    handleDrawerToggle();
                    startGoogleOAuth();
                  }}
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: "100px",
                    color: "text.primary",
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.text.primary, 0.04),
                    },
                  }}
                >
                  Continue with Google
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Drawer>

      <Outlet />
    </Box>
  );
}

