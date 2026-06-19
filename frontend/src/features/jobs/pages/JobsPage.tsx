import WorkOffIcon from "@mui/icons-material/WorkOff";
import { Box, Container, Skeleton, Stack, Typography } from "@mui/material";
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
  const { data: jobs = [], isLoading, isError } = useJobsQuery();
  const { data: applications = [] } = useMyApplicationsQuery();
  const appliedJobIds = useMemo(() => new Set(applications.map((application) => application.jobId)), [applications]);
  const visibleJobs = useMemo(() => filterJobs(jobs, search, filters, sort), [filters, jobs, search, sort]);

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <PageHeader
          title="Browse Jobs"
          subtitle="Search active openings by title, company, skills, location, compensation, and work mode."
        />
        <JobSearchBar search={search} sort={sort} onSearchChange={setSearch} onSortChange={setSort} />
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" },
            alignItems: "start",
          }}
        >
          <JobFilters filters={filters} onChange={setFilters} />
          <Stack spacing={2}>
            <Typography color="text.secondary">{visibleJobs.length} jobs found</Typography>
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
      <ApplyJobDialog job={selectedJob} open={Boolean(selectedJob)} onClose={() => setSelectedJob(null)} />
    </Container>
  );
}
