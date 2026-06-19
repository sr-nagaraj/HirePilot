import TuneIcon from "@mui/icons-material/Tune";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { JobFiltersState } from "../types/jobs";

interface JobFiltersProps {
  filters: JobFiltersState;
  onChange: (filters: JobFiltersState) => void;
}

export function JobFilters({ filters, onChange }: JobFiltersProps) {
  function updateField(field: keyof JobFiltersState, value: string | boolean) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <Stack
      spacing={2}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <TuneIcon color="primary" />
        <Typography variant="h4">Filters</Typography>
      </Stack>
      <TextField
        label="Location"
        value={filters.location}
        onChange={(event) => updateField("location", event.target.value)}
      />
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary">
          Experience
        </Typography>
        <Select
          size="small"
          value={filters.experience}
          onChange={(event) => updateField("experience", event.target.value)}
        >
          <MenuItem value="">Any Experience</MenuItem>
          <MenuItem value="0-2">0-2 years</MenuItem>
          <MenuItem value="3-5">3-5 years</MenuItem>
          <MenuItem value="6-10">6-10 years</MenuItem>
          <MenuItem value="10+">10+ years</MenuItem>
        </Select>
      </Stack>
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary">
          Salary
        </Typography>
        <Select size="small" value={filters.salary} onChange={(event) => updateField("salary", event.target.value)}>
          <MenuItem value="">Any Salary</MenuItem>
          <MenuItem value="500000">5 LPA+</MenuItem>
          <MenuItem value="1000000">10 LPA+</MenuItem>
          <MenuItem value="2000000">20 LPA+</MenuItem>
          <MenuItem value="3000000">30 LPA+</MenuItem>
        </Select>
      </Stack>
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary">
          Employment Type
        </Typography>
        <Select
          size="small"
          value={filters.employmentType}
          onChange={(event) => updateField("employmentType", event.target.value)}
        >
          <MenuItem value="">Any Type</MenuItem>
          <MenuItem value="Full-time">Full-time</MenuItem>
          <MenuItem value="Part-time">Part-time</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
        </Select>
      </Stack>
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.remote}
            onChange={(event) => updateField("remote", event.target.checked)}
          />
        }
        label="Remote"
      />
    </Stack>
  );
}
