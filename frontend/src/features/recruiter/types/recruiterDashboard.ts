import type { DashboardMetric } from "../../../shared/types/dashboard";
import type { HorizontalBarDatum } from "../../../shared/components/HorizontalBarChart";

export type RecruiterJobStatus = "ACTIVE" | "OPEN" | "CLOSED" | "INACTIVE" | string;

export type RecruiterApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "HIRED"
  | "REJECTED";

export interface RecruiterJob {
  id: number;
  recruiterId?: number;
  title: string;
  company?: string;
  location?: string;
  jobType?: string;
  employmentType?: string;
  experienceRequired?: number;
  salary?: number;
  description?: string;
  skills?: string;
  status?: RecruiterJobStatus;
  createdAt?: string;
}

export interface JobApplication {
  id: number;
  jobId?: number;
  candidateId: number;
  status: RecruiterApplicationStatus;
  appliedAt?: string;
  candidateName?: string;
}

export interface RecruiterJobApplications {
  job: RecruiterJob;
  applications: JobApplication[];
}

export interface RecruiterApplicationWithJob extends JobApplication {
  jobId: number;
  jobTitle: string;
}

export interface RecruiterJobPayload {
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceRequired: number | null;
  salary: number | null;
  description: string;
}

export interface HiringFunnel {
  received: number;
  reviewed: number;
  shortlisted: number;
  interview: number;
  selected: number;
}

export interface RecruiterDashboardMetrics {
  jobsPosted: number;
  activeJobs: number;
  applicationsReceived: number;
  candidatesShortlisted: number;
  interviewsScheduled: number;
}

export interface RecentRecruiterJob extends RecruiterJob {
  applicationCount: number;
}

export interface RecruiterDashboardSourceData {
  jobs: RecruiterJob[];
  jobApplications: RecruiterJobApplications[];
}

export interface RecruiterDashboardData {
  metrics: DashboardMetric[];
  metricCounts: RecruiterDashboardMetrics;
  hiringFunnelCounts: HiringFunnel;
  hiringFunnel: HorizontalBarDatum[];
  applicationsPerJob: HorizontalBarDatum[];
  jobsWithApplicationCounts: RecentRecruiterJob[];
  recentApplicants: RecruiterApplicationWithJob[];
  recentJobs: RecentRecruiterJob[];
}
