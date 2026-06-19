export type JobStatus = "OPEN" | "CLOSED";
export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "REJECTED"
  | "HIRED";

export interface Job {
  id: number;
  recruiterId?: number;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  employmentType?: string;
  experienceRequired?: number;
  salary?: number;
  description?: string;
  requirements?: string;
  benefits?: string;
  skills?: string;
  remote?: boolean;
  status?: JobStatus;
  deleted?: boolean;
  createdAt?: string;
}

export interface JobFiltersState {
  location: string;
  experience: string;
  salary: string;
  employmentType: string;
  remote: boolean;
}

export type JobSortOption = "relevant" | "latest" | "salary";

export interface JobSearchState {
  keyword: string;
  location: string;
  skills: string;
  company: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  candidateId?: number;
  resumeId: number;
  status: ApplicationStatus;
  appliedAt?: string;
  jobTitle?: string;
  companyName?: string | null;
  jobDeleted?: boolean;
}

export interface EnrichedApplication extends JobApplication {
  job?: Job;
}
