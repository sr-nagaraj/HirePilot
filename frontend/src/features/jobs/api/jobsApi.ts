import { apiClient } from "../../../services/apiClient";
import type { Job } from "../types/jobs";

export async function getJobs() {
  const { data } = await apiClient.get<Job[]>("/api/jobs/all");
  return data;
}

export async function getJobById(jobId: number | string) {
  const { data } = await apiClient.get<Job>(`/api/jobs/id/${jobId}`);
  return data;
}

export async function getRecruiterJobs() {
  const { data } = await apiClient.get<Job[]>("/api/jobs/my-jobs");
  return data;
}
