import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export interface HorizontalBarDatum {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarChartProps {
  data: HorizontalBarDatum[];
}

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Stack spacing={1.5}>
      {data.map((item) => (
        <Stack key={item.label} spacing={0.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography fontWeight={700}>{item.label}</Typography>
            <Typography color="text.secondary">{item.value}</Typography>
          </Stack>
          <Box>
            <LinearProgress
              variant="determinate"
              value={(item.value / max) * 100}
              sx={{
                height: 9,
                borderRadius: 8,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  bgcolor: item.color ?? "primary.main",
                },
              }}
            />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
