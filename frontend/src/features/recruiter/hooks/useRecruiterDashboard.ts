import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../services/queryKeys";
import { getRecruiterDashboardSourceData } from "../api/recruiterDashboardApi";
import type {
  HiringFunnel,
  JobApplication,
  RecruiterApplicationStatus,
  RecruiterApplicationWithJob,
  RecruiterDashboardData,
  RecruiterDashboardMetrics,
} from "../types/recruiterDashboard";

const chartColors = {
  received: "#2563eb",
  reviewed: "#7c3aed",
  shortlisted: "#0f766e",
  interview: "#c47d10",
  selected: "#15803d",
};

function countByStatus(applications: JobApplication[], status: RecruiterApplicationStatus) {
  return applications.filter((application) => application.status === status).length;
}

function countByStatuses(applications: JobApplication[], statuses: RecruiterApplicationStatus[]) {
  return applications.filter((application) => statuses.includes(application.status)).length;
}

function getTime(value?: string) {
  return value ? new Date(value).getTime() || 0 : 0;
}

export function useRecruiterDashboard() {
  const query = useQuery({
    queryKey: queryKeys.recruiter.dashboard,
    queryFn: getRecruiterDashboardSourceData,
  });

  const dashboard = useMemo<RecruiterDashboardData | undefined>(() => {
    if (!query.data) {
      return undefined;
    }

    const { jobs, jobApplications } = query.data;
    const applications: RecruiterApplicationWithJob[] = jobApplications.flatMap(({ job, applications: jobApps }) =>
      jobApps.map((application) => ({
        ...application,
        jobId: application.jobId ?? job.id,
        jobTitle: job.title,
      })),
    );
    const hasJobStatuses = jobs.some((job) => typeof job.status === "string");
    const activeJobs = hasJobStatuses
      ? jobs.filter((job) => ["ACTIVE", "OPEN"].includes(job.status ?? "")).length
      : jobs.length;
    const metricCounts: RecruiterDashboardMetrics = {
      jobsPosted: jobs.length,
      activeJobs,
      applicationsReceived: applications.length,
      candidatesShortlisted: countByStatus(applications, "SHORTLISTED"),
      interviewsScheduled: countByStatuses(applications, ["INTERVIEW", "INTERVIEW_SCHEDULED"]),
    };
    const hiringFunnelCounts: HiringFunnel = {
      received: applications.length,
      reviewed: countByStatus(applications, "REVIEWED"),
      shortlisted: metricCounts.candidatesShortlisted,
      interview: metricCounts.interviewsScheduled,
      selected: countByStatuses(applications, ["SELECTED", "HIRED"]),
    };

    return {
      metricCounts,
      hiringFunnelCounts,
      metrics: [
        {
          key: "jobsPosted",
          label: "Jobs Posted",
          value: String(metricCounts.jobsPosted),
          helper: "Roles created by your team.",
        },
        {
          key: "activeJobs",
          label: "Active Jobs",
          value: String(metricCounts.activeJobs),
          helper: "Open roles accepting candidates.",
        },
        {
          key: "applicationsReceived",
          label: "Applications Received",
          value: String(metricCounts.applicationsReceived),
          helper: "Applications across your jobs.",
        },
        {
          key: "candidatesShortlisted",
          label: "Candidates Shortlisted",
          value: String(metricCounts.candidatesShortlisted),
          helper: "Candidates moved forward.",
        },
        {
          key: "interviewsScheduled",
          label: "Interviews Scheduled",
          value: String(metricCounts.interviewsScheduled),
          helper: "Candidates in interview stage.",
        },
      ],
      applicationsPerJob: jobApplications
        .map(({ job, applications: jobApps }) => ({
          label: job.title,
          value: jobApps.length,
          color: chartColors.received,
        }))
        .sort((left, right) => right.value - left.value)
        .slice(0, 6),
      hiringFunnel: [
        { label: "Received", value: hiringFunnelCounts.received, color: chartColors.received },
        { label: "Reviewed", value: hiringFunnelCounts.reviewed, color: chartColors.reviewed },
        { label: "Shortlisted", value: hiringFunnelCounts.shortlisted, color: chartColors.shortlisted },
        { label: "Interview", value: hiringFunnelCounts.interview, color: chartColors.interview },
        { label: "Selected", value: hiringFunnelCounts.selected, color: chartColors.selected },
      ],
      jobsWithApplicationCounts: [...jobs]
        .sort((left, right) => getTime(right.createdAt) - getTime(left.createdAt))
        .map((job) => ({
          ...job,
          applicationCount: jobApplications.find((group) => group.job.id === job.id)?.applications.length ?? 0,
        })),
      recentApplicants: [...applications]
        .sort((left, right) => getTime(right.appliedAt) - getTime(left.appliedAt))
        .slice(0, 6),
      recentJobs: [...jobs]
        .sort((left, right) => getTime(right.createdAt) - getTime(left.createdAt))
        .slice(0, 5)
        .map((job) => ({
          ...job,
          applicationCount: jobApplications.find((group) => group.job.id === job.id)?.applications.length ?? 0,
        })),
    };
  }, [query.data]);

  return {
    ...query,
    data: dashboard,
  };
}
