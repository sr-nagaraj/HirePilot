import { getMyProfile, calculateProfileCompletion } from "../../profile/api/profileApi";
import { getResumes } from "../../resume/api/resumeApi";
import { getMyApplications } from "../../jobs/api/applicationsApi";
import { getJobs } from "../../jobs/api/jobsApi";
import type { EnrichedApplication, Job } from "../../jobs/types/jobs";
import { useAuthStore } from "../../../app/store/authStore";
import type { DashboardMetric } from "../../../shared/types/dashboard";

export interface CandidateDashboardData {
  metrics: DashboardMetric[];
  statusChart: Array<{ label: string; value: number; color: string }>;
  recentApplications: EnrichedApplication[];
  recommendedJobs: Job[];
  insights: string[];
  profileCompletion: number;
}

function statusCount(applications: EnrichedApplication[], status: EnrichedApplication["status"]) {
  return applications.filter((application) => application.status === status).length;
}

function scoreJob(job: Job, profileSkills: string[], location?: string) {
  const searchable = `${job.title} ${job.description ?? ""} ${job.skills ?? ""}`.toLowerCase();
  const skillScore = profileSkills.filter((skill) => searchable.includes(skill)).length;
  const locationScore = location && job.location?.toLowerCase().includes(location.toLowerCase()) ? 1 : 0;
  return skillScore * 2 + locationScore;
}

export async function getCandidateDashboard(): Promise<CandidateDashboardData> {
  const [profile, resumes, applications, jobs] = await Promise.all([
    getMyProfile(),
    getResumes(),
    getMyApplications(),
    getJobs(),
  ]);
  const enrichedApplications = applications.map((application) => ({
    ...application,
    job: jobs.find((job) => job.id === application.jobId),
  }));
  const email = useAuthStore.getState().email;
  const role = useAuthStore.getState().role;
  const profileCompletion = calculateProfileCompletion(profile, email, role);
  const pending = enrichedApplications.filter((application) =>
    ["APPLIED", "REVIEWED"].includes(application.status),
  ).length;
  const appliedJobIds = new Set(enrichedApplications.map((application) => application.jobId));
  const profileSkills = (profile?.skills ?? "")
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);
  const recommendedJobs = jobs
    .filter((job) => !appliedJobIds.has(job.id))
    .sort((left, right) => {
      const rightScore = scoreJob(right, profileSkills, profile?.location);
      const leftScore = scoreJob(left, profileSkills, profile?.location);
      return rightScore - leftScore;
    })
    .slice(0, 3);

  return {
    profileCompletion,
    metrics: [
      {
        key: "profileCompletion",
        label: "Profile Completion",
        value: `${profileCompletion}%`,
        helper: "Readiness for recruiter screening.",
      },
      {
        key: "appliedJobs",
        label: "Applied Jobs",
        value: String(enrichedApplications.length),
        helper: "Total submitted applications.",
      },
      {
        key: "shortlistedJobs",
        label: "Shortlisted Jobs",
        value: String(statusCount(enrichedApplications, "SHORTLISTED")),
        helper: "Applications moving ahead.",
      },
      {
        key: "rejectedJobs",
        label: "Rejected Jobs",
        value: String(statusCount(enrichedApplications, "REJECTED")),
        helper: "Closed unsuccessful outcomes.",
      },
      {
        key: "pendingApplications",
        label: "Pending Applications",
        value: String(pending),
        helper: "Awaiting recruiter decision.",
      },
    ],
    statusChart: [
      { label: "Applied", value: statusCount(enrichedApplications, "APPLIED"), color: "#2563eb" },
      { label: "Under Review", value: statusCount(enrichedApplications, "REVIEWED"), color: "#7c3aed" },
      { label: "Shortlisted", value: statusCount(enrichedApplications, "SHORTLISTED"), color: "#0f766e" },
      {
        label: "Interview Scheduled",
        value: statusCount(enrichedApplications, "INTERVIEW_SCHEDULED"),
        color: "#c47d10",
      },
      { label: "Rejected", value: statusCount(enrichedApplications, "REJECTED"), color: "#dc2626" },
      { label: "Selected", value: statusCount(enrichedApplications, "HIRED"), color: "#15803d" },
    ],
    recentApplications: enrichedApplications
      .sort(
        (left, right) =>
          new Date(right.appliedAt ?? 0).getTime() - new Date(left.appliedAt ?? 0).getTime(),
      )
      .slice(0, 5),
    recommendedJobs,
    insights: [
      profileCompletion >= 80
        ? "Your profile is strong for recruiter review."
        : "Complete your profile to improve recruiter screening context.",
      resumes.length
        ? "Your resume center has an application-ready resume."
        : "Upload a resume before applying to jobs.",
      pending
        ? `${pending} applications are still waiting for recruiter action.`
        : "No applications are currently pending.",
    ],
  };
}
