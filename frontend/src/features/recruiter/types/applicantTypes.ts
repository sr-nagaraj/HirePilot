import type { ApplicationStatus } from "../../jobs/types/jobs";

export interface CandidateProfile {
  userId: number;
  fullName: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
  phoneNumber?: string;
  email?: string;
  education?: string;
  bio?: string;
  skills?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  designation?: string;
  experience?: number;
}

export interface CandidateResume {
  resumeId: number;
  fileName: string;
  fileUrl: string;
  uploadedAt?: string;
}

export interface CandidateResumeScore {
  overallScore: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
}

export interface ApplicantDetails {
  applicationId: number;
  userId: number;
  profile: CandidateProfile | null;
  resume: CandidateResume | null;
  resumeScore: CandidateResumeScore | null;
  applicationStatus: ApplicationStatus;
  appliedDate: string;
}
