import { apiClient, isApiStatus } from "../../../services/apiClient";
import type { AuthRole } from "../../../shared/types/auth";
import type {
  Profile,
  ProfileFormValues,
  UpdateProfilePayload,
} from "../types/profile";

function normalizeProfile(profile: Profile | null): Profile | null {
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    phone: profile.phone ?? profile.phoneNumber ?? "",
    aboutMe: profile.aboutMe ?? profile.bio ?? "",
    websiteUrl: profile.websiteUrl ?? profile.portfolio ?? "",
  };
}

export function profileToFormValues(
  profile: Profile | null,
  fallbackEmail: string | null,
): ProfileFormValues {
  return {
    fullName: profile?.fullName ?? "",
    headline: profile?.headline ?? "",
    location: profile?.location ?? "",
    phone: profile?.phone ?? profile?.phoneNumber ?? "",
    email: profile?.email ?? fallbackEmail ?? "",
    bio: profile?.bio ?? profile?.aboutMe ?? "",
    companyName: profile?.companyName ?? "",
    designation: profile?.designation ?? "",
    skills: profile?.skills ?? "",
    experience: profile?.experience ?? null,
    education: profile?.education ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    githubUrl: profile?.githubUrl ?? "",
    websiteUrl: profile?.websiteUrl ?? profile?.portfolio ?? "",
    profilePicture: profile?.profilePicture ?? "",
    aboutMe: profile?.aboutMe ?? profile?.bio ?? "",
  };
}

export function formValuesToProfilePayload(values: ProfileFormValues): UpdateProfilePayload {
  return {
    fullName: values.fullName,
    headline: values.headline,
    location: values.location,
    phoneNumber: values.phone,
    email: values.email,
    bio: values.bio || values.aboutMe,
    companyName: values.companyName,
    designation: values.designation,
    skills: values.skills,
    experience: values.experience,
    education: values.education,
    linkedinUrl: values.linkedinUrl,
    githubUrl: values.githubUrl,
    websiteUrl: values.websiteUrl,
    portfolio: values.websiteUrl,
    profilePicture: values.profilePicture,
    aboutMe: values.aboutMe || values.bio,
  };
}

export async function getProfile() {
  try {
    const { data } = await apiClient.get<Profile>("/api/profile/me");
    return normalizeProfile(data);
  } catch (error) {
    if (isApiStatus(error, 404)) {
      return null;
    }

    throw error;
  }
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await apiClient.put<Profile>("/api/profile/me", payload);
  return normalizeProfile({ ...payload, ...data });
}

export const getMyProfile = getProfile;
export const updateMyProfile = updateProfile;

const completionFields: Array<keyof ProfileFormValues> = [
  "fullName",
  "headline",
  "location",
  "phone",
  "email",
  "skills",
  "experience",
  "education",
  "linkedinUrl",
  "githubUrl",
  "websiteUrl",
  "aboutMe",
  "profilePicture",
];

const recruiterCompletionFields: Array<keyof ProfileFormValues> = [
  "fullName",
  "headline",
  "location",
  "phone",
  "email",
  "education",
  "bio",
  "companyName",
  "designation",
  "experience",
  "skills",
  "linkedinUrl",
  "githubUrl",
  "websiteUrl",
  "profilePicture",
];

export function calculateProfileCompletion(
  profile: Profile | null,
  email: string | null,
  role?: AuthRole | null,
) {
  if (!profile) return 0;

  const values = profileToFormValues(profile, email);
  const fields = role === "RECRUITER" ? recruiterCompletionFields : completionFields;
  const completed = fields.filter((field) => {
    const value = values[field];
    return typeof value === "number" ? value >= 0 : Boolean(value?.toString().trim());
  }).length;

  return Math.round((completed / fields.length) * 100);
}

export async function uploadProfilePicture(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<string>("/api/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}
