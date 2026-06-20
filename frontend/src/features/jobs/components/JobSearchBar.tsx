import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Badge, Box, Button, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import type { JobSearchState, JobSortOption } from "../types/jobs";

interface JobSearchBarProps {
  search: JobSearchState;
  sort: JobSortOption;
  onSearchChange: (search: JobSearchState) => void;
  onSortChange: (sort: JobSortOption) => void;
  onFiltersToggle?: () => void;
  activeFiltersCount?: number;
}

export function JobSearchBar({
  search,
  sort,
  onSearchChange,
  onSortChange,
  onFiltersToggle,
  activeFiltersCount = 0,
}: JobSearchBarProps) {
  function updateField(field: keyof JobSearchState, value: string) {
    onSearchChange({ ...search, [field]: value });
  }

  return (
    <Box>
      {/* Mobile/Tablet Layout: Single keyword search input + Filters toggle button */}
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          gap: 1.5,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search jobs by title, company, skills..."
          value={search.keyword}
          onChange={(event) => updateField("keyword", event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: "100px", height: 50 },
          }}
        />
        <Badge
          badgeContent={activeFiltersCount}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              top: 4,
              right: 4,
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={onFiltersToggle}
            startIcon={<TuneIcon />}
            sx={{
              borderRadius: "100px",
              px: 3,
              height: 50, // Match TextField height
              borderColor: "divider",
              color: "text.primary",
              whiteSpace: "nowrap",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "action.hover",
              },
            }}
          >
            Filters
          </Button>
        </Badge>
      </Box>

      {/* Desktop Layout: Detailed inputs grid */}
      <Box
        sx={{
          display: { xs: "none", lg: "grid" },
          gap: 2,
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr 180px",
        }}
      >
        <TextField
          label="Job Title / Keyword"
          value={search.keyword}
          onChange={(event) => updateField("keyword", event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Company"
          value={search.company}
          onChange={(event) => updateField("company", event.target.value)}
        />
        <TextField
          label="Skills"
          value={search.skills}
          onChange={(event) => updateField("skills", event.target.value)}
        />
        <TextField
          label="Location"
          value={search.location}
          onChange={(event) => updateField("location", event.target.value)}
        />
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Sort
          </Typography>
          <Select
            size="small"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as JobSortOption)}
          >
            <MenuItem value="relevant">Most Relevant</MenuItem>
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="salary">Highest Salary</MenuItem>
          </Select>
        </Stack>
      </Box>
    </Box>
  );
}

