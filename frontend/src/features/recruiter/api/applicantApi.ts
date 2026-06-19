import { apiClient } from "../../../services/apiClient";
import type { ApplicantDetails } from "../types/applicantTypes";

export async function getApplicantDetails(jobId: number | string): Promise<ApplicantDetails[]> {
  const { data } = await apiClient.get<ApplicantDetails[]>(`/api/applications/job/${jobId}/applicants/details`);
  return data;
}
