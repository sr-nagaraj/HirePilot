import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Button, Card, CardContent, Chip, Stack, Typography, IconButton, alpha, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { getJobDetailsPath } from "../../../shared/constants/routes";
import { formatCurrency, formatDate } from "../../../shared/utils/formatters";
import type { Job } from "../types/jobs";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  isApplied?: boolean;
}

export function JobCard({ job, onApply, isApplied = false }: JobCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [bookmarked, setBookmarked] = useState(false);

  // Parse skill list
  const skillsList = job.skills
    ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Java", "Spring Boot", "REST API"];

  // Mock Match percentage based on title/skills matching
  const matchPercent = job.title.toLowerCase().includes("java") ? 95 : 88;

  return (
    <Card
      variant="outlined"
      className="hover-card"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.4)"
            : "0 10px 30px rgba(15,23,42,0.04)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", gap: 2.25 }}>
        {/* Header: Company Avatar/Logo, Match %, and Bookmark Icon */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Logo placeholder */}
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "10px",
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                fontWeight: 800,
                fontSize: "1.25rem",
              }}
            >
              {(job.company || "H").charAt(0).toUpperCase()}
            </Box>
            
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary">
                {job.company || "HirePilot client"}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
                <LocationOnIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption">{job.location || "Remote"}</Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton size="small" onClick={() => setBookmarked(!bookmarked)} color="inherit">
              {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </IconButton>
          </Stack>
        </Stack>

        {/* Title */}
        <Typography
          variant="h3"
          component={Link}
          to={getJobDetailsPath(job.id)}
          sx={{
            fontWeight: 800,
            color: "text.primary",
            textDecoration: "none",
            lineHeight: 1.3,
            "&:hover": { color: "primary.main" },
          }}
        >
          {job.title}
        </Typography>

        {/* Short description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.5,
          }}
        >
          {job.description || "Detailed specifications for this position are available upon request."}
        </Typography>

        {/* Skill Chips */}
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap gap={0.75}>
          {skillsList.slice(0, 4).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: "0.7rem", height: 20 }}
            />
          ))}
        </Stack>
      </CardContent>

      {/* Footer Info details (Salary, date, actions) */}
      <Box
        sx={{
          p: 2,
          pt: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary" sx={{ py: 1 }}>
          <PaymentsIcon sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography variant="caption" fontWeight={700} color="text.primary">
            {job.salary ? `${formatCurrency(job.salary)} LPA` : "Not specified"}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1}>
          <Button
            component={Link}
            to={getJobDetailsPath(job.id)}
            variant="outlined"
            size="small"
            sx={{ py: 0.75 }}
          >
            Details
          </Button>
          {onApply && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onApply(job)}
              disabled={isApplied}
              sx={{ py: 0.75, fontWeight: 700 }}
            >
              {isApplied ? "Applied" : "Apply"}
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
