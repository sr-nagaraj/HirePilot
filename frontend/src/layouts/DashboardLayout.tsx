import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Drawer,
  alpha,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../app/store/authStore";
import { Logo } from "../shared/components/Logo";
import { ThemeModeToggle } from "../shared/components/ThemeModeToggle";
import { useProfileQuery } from "../features/profile/hooks/useProfileQuery";
import { API_BASE_URL } from "../shared/constants/app";
import { ROLE_LABELS, ROUTES } from "../shared/constants/routes";
import { useToast } from "../shared/hooks/useToast";
import { getDashboardPath } from "../shared/utils/getDashboardPath";
import { DashboardNav } from "./DashboardNav";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_WIDTH = 260;

export function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const email = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const { data: profile = null } = useProfileQuery({
    enabled: Boolean(role),
  });
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isDark = theme.palette.mode === "dark";
  const roleLabel = role ? ROLE_LABELS[role] : "User";
  const displayName = profile?.fullName || email || "HirePilot user";
  const avatarInitial = displayName.charAt(0).toUpperCase() || "H";
  const showRecruiterProfile = role === "RECRUITER" && Boolean(profile);

  const getAvatarSrc = () => {
    if (!profile?.profilePicture) return undefined;
    if (profile.profilePicture.startsWith("http")) return profile.profilePicture;
    return `${API_BASE_URL}/${profile.profilePicture}`;
  };

  function handleLogout() {
    logout();
    setAnchorEl(null);
    showToast("Signed out successfully.", "success");
    navigate(ROUTES.LOGIN, { replace: true });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
      {/* Sidebar Header / Logo */}
      <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", borderBottom: "1px solid", borderColor: "divider", minHeight: 64 }}>
        <Box component={Link} to={getDashboardPath(role)} aria-label="HirePilot dashboard" onClick={() => setMobileOpen(false)} sx={{ display: "flex", alignItems: "center" }}>
          <Logo />
        </Box>
      </Box>

      {/* Nav links */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <DashboardNav role={role} onItemClick={() => setMobileOpen(false)} />
      </Box>

      {/* Sidebar Footer details */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
        {showRecruiterProfile ? (
          <Stack spacing={1} sx={{ mb: 2, px: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar src={getAvatarSrc()} sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 15 }}>
                {avatarInitial}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {profile?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {[profile?.designation, profile?.companyName].filter(Boolean).join(" - ")}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1} sx={{ mb: 2, px: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={getAvatarSrc()} sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 15 }}>
                {avatarInitial}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {email}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        )}
        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
          <Chip label={roleLabel} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
          <ThemeModeToggle />
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Left Sidebar for Desktop */}
      <Box
        component="nav"
        sx={{
          width: { md: SIDEBAR_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" },
          borderRight: "1px solid",
          borderColor: "divider",
          position: "fixed",
          height: "100vh",
          zIndex: 1200,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            borderRight: "1px solid",
            borderColor: "divider",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main layout wrapper */}
      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          marginLeft: { md: `${SIDEBAR_WIDTH}px` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sticky Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          color="inherit"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            zIndex: 1100,
            backdropFilter: "blur(8px)",
            bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 3 }, gap: 2, justifyContent: "space-between", minHeight: 64 }}>
            {/* Hamburger menu for mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            {/* Toolbar Actions */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton color="inherit" aria-label="notifications">
                <NotificationsNoneIcon />
              </IconButton>
              
              <IconButton
                color="inherit"
                aria-label="open profile menu"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{ p: 0.5 }}
              >
                <Avatar src={getAvatarSrc()} sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 15 }}>
                  {avatarInitial}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ backdrop: { sx: { backgroundColor: "transparent" } } }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    border: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {displayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {email}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <MenuItem component={Link} to={role === "RECRUITER" ? ROUTES.RECRUITER_PROFILE : ROUTES.CANDIDATE_PROFILE} onClick={() => setAnchorEl(null)}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box
          component={motion.main}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          sx={{
            flexGrow: 1,
            py: { xs: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
