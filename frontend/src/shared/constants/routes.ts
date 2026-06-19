import type { AuthRole } from "../types/auth";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  OAUTH_SUCCESS: "/oauth-success",
  OAUTH_ROLE_SELECTION: "/oauth-role-selection",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  CANDIDATE_DASHBOARD: "/candidate/dashboard",
  CANDIDATE_PROFILE: "/candidate/dashboard/profile",
  CANDIDATE_RESUMES: "/candidate/dashboard/resumes",
  CANDIDATE_JOBS: "/candidate/dashboard/jobs",
  CANDIDATE_JOB_DETAILS: "/candidate/dashboard/jobs/:jobId",
  CANDIDATE_APPLICATIONS: "/candidate/dashboard/applications",
  RESUME_SCORE: "/profile/resume-score",
  RECRUITER_DASHBOARD: "/recruiter/dashboard",
  RECRUITER_PROFILE: "/recruiter/profile",
  RECRUITER_JOBS: "/recruiter/jobs",
  RECRUITER_CREATE_JOB: "/recruiter/jobs/create",
  RECRUITER_JOB_DETAILS: "/recruiter/jobs/:jobId",
  RECRUITER_EDIT_JOB: "/recruiter/jobs/:jobId/edit",
  RECRUITER_APPLICANTS: "/recruiter/jobs/:jobId/applicants",
  ADMIN_DASHBOARD: "/admin/dashboard",
  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "/not-found",
} as const;

export const ROLE_DASHBOARD_ROUTES: Record<AuthRole, string> = {
  CANDIDATE: ROUTES.CANDIDATE_DASHBOARD,
  RECRUITER: ROUTES.RECRUITER_DASHBOARD,
  ADMIN: ROUTES.ADMIN_DASHBOARD,
};

export const ROLE_LABELS: Record<AuthRole, string> = {
  CANDIDATE: "Candidate",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
};

export function getJobDetailsPath(jobId: number | string) {
  return ROUTES.CANDIDATE_JOB_DETAILS.replace(":jobId", String(jobId));
}

export function getRecruiterJobsPath() {
  return ROUTES.RECRUITER_JOBS;
}

export function getRecruiterCreateJobPath() {
  return ROUTES.RECRUITER_CREATE_JOB;
}

export function getRecruiterJobPath(jobId: number | string) {
  return ROUTES.RECRUITER_JOB_DETAILS.replace(":jobId", String(jobId));
}

export function getRecruiterEditJobPath(jobId: number | string) {
  return ROUTES.RECRUITER_EDIT_JOB.replace(":jobId", String(jobId));
}

export function getRecruiterApplicantsPath(jobId: number | string) {
  return ROUTES.RECRUITER_APPLICANTS.replace(":jobId", String(jobId));
}
