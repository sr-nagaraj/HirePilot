import { apiClient } from "../../../services/apiClient";
import type { ApplicationStatus, JobApplication } from "../types/jobs";

export async function applyToJob(jobId: number, resumeId: number) {
  const { data } = await apiClient.post<JobApplication>(`/api/jobs/${jobId}/apply`, { resumeId });
  return data;
}

export async function getMyApplications() {
  const { data } = await apiClient.get<JobApplication[]>("/api/applications/my");
  return data;
}

export async function getJobApplications(jobId: number) {
  const { data } = await apiClient.get<JobApplication[]>(`/api/jobs/${jobId}/applications`);
  return data;
}

export async function updateApplicationStatus(applicationId: number, status: ApplicationStatus) {
  const { data } = await apiClient.put<JobApplication>(`/api/applications/${applicationId}/status`, {
    status,
  });
  return data;
}
