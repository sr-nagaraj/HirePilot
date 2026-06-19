import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

interface DashboardSkeletonProps {
  actionCount?: number;
  statCount?: number;
}

export function DashboardSkeleton({ actionCount = 4, statCount = 3 }: DashboardSkeletonProps) {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        {Array.from({ length: actionCount }).map((_, index) => (
          <Card key={`action-skeleton-${index}`} variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton variant="rounded" width={38} height={38} />
              <Skeleton variant="text" width="70%" sx={{ mt: 1.5 }} />
              <Skeleton variant="text" width="92%" />
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {Array.from({ length: statCount }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="35%" height={58} />
              <Skeleton variant="text" width="78%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
