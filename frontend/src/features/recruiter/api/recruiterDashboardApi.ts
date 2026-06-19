import { apiClient } from "../../../services/apiClient";
import type {
  JobApplication,
  RecruiterApplicationStatus,
  RecruiterDashboardSourceData,
  RecruiterJob,
  RecruiterJobApplications,
  RecruiterJobPayload,
} from "../types/recruiterDashboard";

export async function getRecruiterJobs(): Promise<RecruiterJob[]> {
  const { data } = await apiClient.get<RecruiterJob[]>("/api/jobs/my-jobs");
  return data;
}

export async function getApplicationsForJob(jobId: number): Promise<JobApplication[]> {
  const { data } = await apiClient.get<JobApplication[]>(`/api/jobs/${jobId}/applications`);
  return data;
}

export async function getRecruiterJobById(jobId: number | string): Promise<RecruiterJob> {
  const { data } = await apiClient.get<RecruiterJob>(`/api/jobs/id/${jobId}`);
  return data;
}

export async function createRecruiterJob(payload: RecruiterJobPayload): Promise<RecruiterJob> {
  const { data } = await apiClient.post<RecruiterJob>("/api/jobs", payload);
  return data;
}

export async function updateRecruiterJob(jobId: number | string, payload: RecruiterJobPayload): Promise<RecruiterJob> {
  const { data } = await apiClient.put<RecruiterJob>(`/api/jobs/${jobId}`, payload);
  return data;
}

export async function deleteRecruiterJob(jobId: number | string): Promise<void> {
  await apiClient.delete(`/api/jobs/${jobId}`);
}

export async function updateApplicationStatus(
  applicationId: number,
  status: RecruiterApplicationStatus,
): Promise<JobApplication> {
  const { data } = await apiClient.put<JobApplication>(`/api/applications/${applicationId}/status`, { status });
  return data;
}

export async function getRecruiterDashboardSourceData(): Promise<RecruiterDashboardSourceData> {
  const jobs = await getRecruiterJobs();
  const jobApplications: RecruiterJobApplications[] = await Promise.all(
    jobs.map(async (job) => ({
      job,
      applications: await getApplicationsForJob(job.id),
    })),
  );

  return {
    jobs,
    jobApplications,
  };
}
