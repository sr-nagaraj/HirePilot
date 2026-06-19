export const queryKeys = {
  profile: {
    me: ["profile", "me"] as const,
  },
  resumes: {
    list: ["resumes"] as const,
  },
  jobs: {
    all: ["jobs", "all"] as const,
    detail: (jobId: number | string) => ["jobs", "detail", String(jobId)] as const,
    recruiter: ["jobs", "recruiter"] as const,
    applications: (jobId: number | string) =>
      ["jobs", "applications", String(jobId)] as const,
    applicantDetails: (jobId: number | string) =>
      ["jobs", "applicantDetails", String(jobId)] as const,
  },
  applications: {
    my: ["applications", "my"] as const,
  },
  candidate: {
    dashboard: ["candidate", "dashboard"] as const,
  },
  recruiter: {
    dashboard: ["recruiter", "dashboard"] as const,
  },
  admin: {
    dashboard: ["admin", "dashboard"] as const,
  },
};
