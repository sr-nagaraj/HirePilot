import { z } from "zod";

function isValidUrlOrEmpty(value: string): boolean {
  return !value || /^https?:\/\/.+/i.test(value);
}

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  headline: z.string().trim().max(100, "Headline cannot exceed 100 characters."),
  location: z.string().trim().max(100, "Location cannot exceed 100 characters."),
  phone: z.string().trim(),
  email: z.string().trim(),
  bio: z.string().trim().max(2000, "Bio cannot exceed 2000 characters."),
  companyName: z.string().trim().max(160, "Company name is too long."),
  designation: z.string().trim().max(160, "Designation is too long."),
  skills: z.string().trim().max(1000, "Skills cannot exceed 1000 characters."),
  experience: z
    .number({ invalid_type_error: "Experience must be a number." })
    .min(0, "Experience cannot be negative.")
    .max(60, "Experience looks too high.")
    .nullable(),
  education: z.string().trim().max(255, "Education cannot exceed 255 characters."),
  linkedinUrl: z.string().trim(),
  githubUrl: z.string().trim(),
  websiteUrl: z.string().trim(),
  profilePicture: z.string().trim(),
  aboutMe: z.string().trim().max(2000, "About me cannot exceed 2000 characters."),
}).superRefine((data, ctx) => {
  // Phone validation
  if (data.phone && !/^\d{10,15}$/.test(data.phone)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phone number must contain only digits and be between 10 to 15 digits.",
      path: ["phone"],
    });
  }

  // Email validation
  if (data.email && !z.string().email().safeParse(data.email).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter a valid email address.",
      path: ["email"],
    });
  }

  // URL validations
  if (!isValidUrlOrEmpty(data.linkedinUrl)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Use a full https URL.", path: ["linkedinUrl"] });
  }
  if (!isValidUrlOrEmpty(data.githubUrl)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Use a full https URL.", path: ["githubUrl"] });
  }
  if (!isValidUrlOrEmpty(data.websiteUrl)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Use a full https URL.", path: ["websiteUrl"] });
  }
});

export type ProfileSchemaValues = z.infer<typeof profileSchema>;