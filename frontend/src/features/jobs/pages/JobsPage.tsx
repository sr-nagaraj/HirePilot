import CloseIcon from "@mui/icons-material/Close";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { ApplyJobDialog } from "../components/ApplyJobDialog";
import { JobCard } from "../components/JobCard";
import { JobFilters } from "../components/JobFilters";
import { JobSearchBar } from "../components/JobSearchBar";
import { useJobsQuery, useMyApplicationsQuery } from "../hooks/jobsHooks";
import type { Job, JobFiltersState, JobSearchState, JobSortOption } from "../types/jobs";

const defaultSearch: JobSearchState = {
  keyword: "",
  company: "",
  skills: "",
  location: "",
};

const defaultFilters: JobFiltersState = {
  location: "",
  experience: "",
  salary: "",
  employmentType: "",
  remote: false,
};

function includesText(value: string | undefined, query: string) {
  return !query || (value ?? "").toLowerCase().includes(query.toLowerCase());
}

function matchesExperience(job: Job, filter: string) {
  const years = job.experienceRequired ?? 0;

  if (!filter) return true;
  if (filter === "10+") return years >= 10;

  const [min, max] = filter.split("-").map(Number);
  return years >= min && years <= max;
}

function relevanceScore(job: Job, search: JobSearchState) {
  const title = includesText(job.title, search.keyword) ? 4 : 0;
  const company = includesText(job.company, search.company) ? 2 : 0;
  const skills = includesText(job.skills, search.skills) || includesText(job.description, search.skills) ? 2 : 0;
  const location = includesText(job.location, search.location) ? 1 : 0;
  return title + company + skills + location;
}

function getSalaryInLpa(salary?: number) {
  if (!salary) return 0;
  return salary >= 1000 ? salary / 100000 : salary;
}

function filterJobs(jobs: Job[], search: JobSearchState, filters: JobFiltersState, sort: JobSortOption) {
  const filtered = jobs.filter((job) => {
    const remoteText = `${job.jobType ?? ""} ${job.location ?? ""}`.toLowerCase();
    const isRemote = Boolean(job.remote) || remoteText.includes("remote");

    return (
      includesText(job.title, search.keyword) &&
      includesText(job.company, search.company) &&
      (includesText(job.skills, search.skills) || includesText(job.description, search.skills)) &&
      includesText(job.location, search.location) &&
      includesText(job.location, filters.location) &&
      matchesExperience(job, filters.experience) &&
      (!filters.salary || getSalaryInLpa(job.salary) >= Number(filters.salary) / 100000) &&
      (!filters.employmentType || (job.jobType ?? job.employmentType ?? "") === filters.employmentType) &&
      (!filters.remote || isRemote)
    );
  });

  return filtered.sort((left, right) => {
    if (sort === "salary") {
      return getSalaryInLpa(right.salary) - getSalaryInLpa(left.salary);
    }

    if (sort === "latest") {
      return new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime();
    }

    return relevanceScore(right, search) - relevanceScore(left, search);
  });
}

export function JobsPage() {
  const [search, setSearch] = useState(defaultSearch);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState<JobSortOption>("relevant");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data: jobs = [], isLoading, isError } = useJobsQuery();
  const { data: applications = [] } = useMyApplicationsQuery();

  const appliedJobIds = useMemo(() => new Set(applications.map((application) => application.jobId)), [applications]);
  const visibleJobs = useMemo(() => filterJobs(jobs, search, filters, sort), [filters, jobs, search, sort]);

  // Calculate active filter count for the mobile toggle badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.company) count++;
    if (search.skills) count++;
    if (search.location) count++;
    if (filters.location) count++;
    if (filters.experience) count++;
    if (filters.salary) count++;
    if (filters.employmentType) count++;
    if (filters.remote) count++;
    return count;
  }, [search, filters]);

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <PageHeader
          title="Browse Jobs"
          subtitle="Search active openings by title, company, skills, location, compensation, and work mode."
        />
        <JobSearchBar
          search={search}
          sort={sort}
          onSearchChange={setSearch}
          onSortChange={setSort}
          onFiltersToggle={() => setIsFiltersOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" },
            alignItems: "start",
          }}
        >
          {/* Filters Sidebar on Desktop - Hidden on Mobile */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <JobFilters filters={filters} onChange={setFilters} />
          </Box>

          {/* Jobs List - Shown First on Mobile */}
          <Stack spacing={2}>
            <Typography color="text.secondary" fontWeight={500}>
              {visibleJobs.length} jobs found
            </Typography>
            {isLoading ? <Skeleton variant="rounded" height={320} /> : null}
            {isError ? <ErrorState message="Jobs could not be loaded." /> : null}
            {!isLoading && !isError && visibleJobs.length === 0 ? (
              <EmptyState
                icon={<WorkOffIcon />}
                title="No jobs match your search"
                description="Adjust your search terms or filters to discover more openings."
              />
            ) : null}
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
              }}
            >
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={appliedJobIds.has(job.id)}
                  onApply={setSelectedJob}
                />
              ))}
            </Box>
          </Stack>
        </Box>
      </Stack>

      {/* Mobile & Tablet slide-up Filters Drawer */}
      <Drawer
        anchor="right"
        open={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 380 },
            bgcolor: "background.default",
            p: 3.5,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h3" fontWeight={800}>
            Filters & Search
          </Typography>
          <IconButton onClick={() => setIsFiltersOpen(false)} aria-label="close filters">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Scrollable drawer content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 0.5, mb: 2 }}>
          <Stack spacing={3.5}>
            {/* Advanced Search Options */}
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="primary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Advanced Search
              </Typography>
              <TextField
                label="Company"
                fullWidth
                size="small"
                value={search.company}
                onChange={(e) => setSearch({ ...search, company: e.target.value })}
              />
              <TextField
                label="Skills"
                fullWidth
                size="small"
                value={search.skills}
                onChange={(e) => setSearch({ ...search, skills: e.target.value })}
              />
              <TextField
                label="Location (Keyword)"
                fullWidth
                size="small"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
              />
              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Sort By
                </Typography>
                <Select
                  size="small"
                  fullWidth
                  value={sort}
                  onChange={(e) => setSort(e.target.value as JobSortOption)}
                >
                  <MenuItem value="relevant">Most Relevant</MenuItem>
                  <MenuItem value="latest">Latest</MenuItem>
                  <MenuItem value="salary">Highest Salary</MenuItem>
                </Select>
              </Stack>
            </Stack>

            <Divider />

            {/* Filter Section */}
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="primary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Refine Results
              </Typography>
              <JobFilters filters={filters} onChange={setFilters} noBorder />
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Action Buttons inside Drawer */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setSearch(defaultSearch);
              setFilters(defaultFilters);
            }}
            sx={{
              borderRadius: "100px",
              textTransform: "none",
              fontWeight: 700,
              py: 1.25,
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setIsFiltersOpen(false)}
            sx={{
              borderRadius: "100px",
              textTransform: "none",
              fontWeight: 700,
              py: 1.25,
            }}
          >
            Show Results
          </Button>
        </Stack>
      </Drawer>

      <ApplyJobDialog job={selectedJob} open={Boolean(selectedJob)} onClose={() => setSelectedJob(null)} />
    </Container>
  );
}
