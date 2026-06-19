import type { ResumeScoreResponse } from "../../resume-score/types";

export interface Profile {
  id?: number;
  userId?: number;
  fullName?: string;
  headline?: string;
  location?: string;
  phone?: string;
  email?: string;
  skills?: string;
  experience?: number | null;
  education?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  portfolio?: string;
  bio?: string;
  aboutMe?: string;
  companyName?: string;
  designation?: string;
  profilePicture?: string;
  resumeScore?: ResumeScoreResponse;
  phoneNumber?: string;
}

export type CandidateProfile = Profile;
export type RecruiterProfile = Profile;

export interface ProfileFormValues {
  fullName: string;
  headline: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  companyName: string;
  designation: string;
  skills: string;
  experience: number | null;
  education: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  profilePicture: string;
  aboutMe: string;
}

export type UpdateProfilePayload = Partial<Profile>;
