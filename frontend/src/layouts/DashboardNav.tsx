import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PersonIcon from "@mui/icons-material/Person";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, alpha, useTheme } from "@mui/material";
import type { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";
import type { AuthRole } from "../shared/types/auth";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  path: string;
  icon: ReactElement;
}

const candidateNav: NavItem[] = [
  { label: "Dashboard", path: ROUTES.CANDIDATE_DASHBOARD, icon: <DashboardIcon /> },
  { label: "Jobs", path: ROUTES.CANDIDATE_JOBS, icon: <SearchIcon /> },
  { label: "Applications", path: ROUTES.CANDIDATE_APPLICATIONS, icon: <AssignmentTurnedInIcon /> },
  { label: "Profile", path: ROUTES.CANDIDATE_PROFILE, icon: <PersonIcon /> },
  { label: "Resume Center", path: ROUTES.CANDIDATE_RESUMES, icon: <DescriptionIcon /> },
  { label: "Resume Score", path: ROUTES.RESUME_SCORE, icon: <PsychologyIcon /> },
];

const recruiterNav: NavItem[] = [
  { label: "Dashboard", path: ROUTES.RECRUITER_DASHBOARD, icon: <DashboardIcon /> },
  { label: "My Jobs", path: ROUTES.RECRUITER_JOBS, icon: <WorkIcon /> },
  { label: "Create Job", path: ROUTES.RECRUITER_CREATE_JOB, icon: <AddBusinessIcon /> },
  { label: "Profile", path: ROUTES.RECRUITER_PROFILE, icon: <PersonIcon /> },
];

const adminNav: NavItem[] = [{ label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD, icon: <DashboardIcon /> }];

function getNavItems(role: AuthRole | null): NavItem[] {
  if (role === "CANDIDATE") return candidateNav;
  if (role === "RECRUITER") return recruiterNav;
  if (role === "ADMIN") return adminNav;
  return [];
}

export function DashboardNav({ role, onItemClick }: { role: AuthRole | null; onItemClick?: () => void }) {
  const location = useLocation();
  const theme = useTheme();
  const navItems = getNavItems(role);
  const isDark = theme.palette.mode === "dark";

  if (!navItems.length) {
    return null;
  }

  return (
    <List sx={{ px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
      {navItems.map((item) => {
        const isDashboardPath =
          item.path === ROUTES.CANDIDATE_DASHBOARD || item.path === ROUTES.RECRUITER_DASHBOARD;
        const isActive =
          isDashboardPath
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

        return (
          <ListItem key={item.path} disablePadding>
            <Button
              component={Link}
              to={item.path}
              onClick={onItemClick}
              fullWidth
              startIcon={
                <Box
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    display: "flex",
                    transition: "color 0.2s",
                  }}
                >
                  {item.icon}
                </Box>
              }
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                py: 1.25,
                px: 2,
                borderRadius: "10px",
                bgcolor: isActive
                  ? isDark
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.08)
                  : "transparent",
                color: isActive ? "primary.main" : "text.primary",
                fontWeight: isActive ? 600 : 500,
                border: "1px solid",
                borderColor: isActive
                  ? isDark
                    ? alpha(theme.palette.primary.main, 0.25)
                    : alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                "&:hover": {
                  bgcolor: isActive
                    ? isDark
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.primary.main, 0.12)
                    : isDark
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  borderColor: isActive
                    ? undefined
                    : isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(15, 23, 42, 0.04)",
                },
                "& .MuiButton-startIcon": {
                  mr: 1.5,
                },
              }}
            >
              {item.label}
            </Button>
          </ListItem>
        );
      })}
    </List>
  );
}
