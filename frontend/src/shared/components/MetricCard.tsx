import { Card, CardContent, Stack, Typography, Box, alpha, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon: ReactNode;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  gradient?: string;
}

export function MetricCard({ label, value, helper, icon, trend, trendType = "up", gradient }: MetricCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      variant="outlined"
      className="hover-card"
      sx={{
        height: "100%",
        minHeight: 140,
        position: "relative",
        overflow: "hidden",
        bgcolor: isDark ? "background.paper" : "#ffffff",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.5)"
            : "0 10px 30px rgba(15,23,42,0.05)",
          borderColor: isDark ? alpha(theme.palette.primary.main, 0.4) : alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      {/* Top Accent Gradient Border */}
      {gradient && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: gradient,
          }}
        />
      )}

      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: isDark
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.08),
                color: "primary.main",
                border: "1px solid",
                borderColor: isDark
                  ? alpha(theme.palette.primary.main, 0.25)
                  : alpha(theme.palette.primary.main, 0.1),
              }}
            >
              {icon}
            </Stack>
          </Stack>
          
          <Stack spacing={0.5}>
            <Typography variant="h2" component="p" fontWeight={800} sx={{ letterSpacing: "-0.03em" }}>
              {value}
            </Typography>
            
            {(trend || helper) && (
              <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                {trend && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.25}
                    sx={{
                      color: trendType === "up" ? "success.main" : trendType === "down" ? "error.main" : "text.secondary",
                      bgcolor: trendType === "up" 
                        ? alpha(theme.palette.success.main, 0.08) 
                        : trendType === "down" 
                          ? alpha(theme.palette.error.main, 0.08) 
                          : alpha(theme.palette.text.secondary, 0.08),
                      px: 0.75,
                      py: 0.25,
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {trendType === "up" && <ArrowUpwardIcon sx={{ fontSize: 12 }} />}
                    {trendType === "down" && <ArrowDownwardIcon sx={{ fontSize: 12 }} />}
                    {trend}
                  </Stack>
                )}
                {helper && (
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {helper}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
