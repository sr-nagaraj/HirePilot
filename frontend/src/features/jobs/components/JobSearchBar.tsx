import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import type { JobSearchState, JobSortOption } from "../types/jobs";

interface JobSearchBarProps {
  search: JobSearchState;
  sort: JobSortOption;
  onSearchChange: (search: JobSearchState) => void;
  onSortChange: (sort: JobSortOption) => void;
}

export function JobSearchBar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: JobSearchBarProps) {
  function updateField(field: keyof JobSearchState, value: string) {
    onSearchChange({ ...search, [field]: value });
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr 1fr 1fr 180px" },
      }}
    >
      <TextField
        label="Job Title"
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
  );
}
