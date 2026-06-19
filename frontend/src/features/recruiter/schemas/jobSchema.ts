import { z } from "zod";
import type { RecruiterJob, RecruiterJobPayload } from "../types/recruiterDashboard";

export const jobSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(160, "Title is too long."),
  company: z.string().trim().min(2, "Company is required.").max(160, "Company is too long."),
  description: z.string().trim().min(10, "Description is required.").max(4000, "Description is too long."),
  location: z.string().trim().min(2, "Location is required.").max(160, "Location is too long."),
  salary: z
    .number({ invalid_type_error: "Salary must be a number." })
    .min(0, "Salary cannot be negative.")
    .nullable(),
  experience: z
    .number({ invalid_type_error: "Experience must be a number." })
    .min(0, "Experience cannot be negative.")
    .max(60, "Experience looks too high.")
    .nullable(),
  employmentType: z.string().trim().min(2, "Employment type is required.").max(80, "Employment type is too long."),
  skills: z.string().trim().min(2, "Skills are required.").max(1000, "Skills are too long."),
}).superRefine((data, ctx) => {
  if (data.experience === null || data.experience === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Experience is required.",
      path: ["experience"],
    });
  }
});

export type JobSchemaValues = z.infer<typeof jobSchema>;

export const defaultJobValues: JobSchemaValues = {
  title: "",
  company: "HirePilot",
  description: "",
  location: "",
  salary: null,
  experience: null,
  employmentType: "",
  skills: "",
};

export function jobToFormValues(job?: RecruiterJob | null): JobSchemaValues {
  return {
    title: job?.title ?? "",
    company: job?.company ?? "HirePilot",
    description: job?.description ?? "",
    location: job?.location ?? "",
    salary: job?.salary ?? null,
    experience: job?.experienceRequired ?? null,
    employmentType: job?.jobType ?? job?.employmentType ?? "",
    skills: job?.skills ?? "",
  };
}

export function formValuesToJobPayload(values: JobSchemaValues): RecruiterJobPayload {
  const skillsBlock = values.skills ? `\n\nSkills: ${values.skills}` : "";

  return {
    title: values.title,
    company: values.company,
    location: values.location,
    jobType: values.employmentType,
    experienceRequired: values.experience,
    salary: values.salary,
    description: `${values.description}${skillsBlock}`.trim(),
  };
}
