import type { DashboardMetric } from "../../../shared/types/dashboard";
import { delay } from "../../../shared/utils/delay";

interface AdminDashboardData {
  metrics: DashboardMetric[];
}

const adminDashboardData: AdminDashboardData = {
  metrics: [
    {
      key: "totalUsers",
      label: "Total Users",
      value: "1,248",
      helper: "Users across all HirePilot roles.",
    },
    {
      key: "candidates",
      label: "Candidates",
      value: "932",
      helper: "Candidate accounts in the platform.",
    },
    {
      key: "recruiters",
      label: "Recruiters",
      value: "214",
      helper: "Recruiter users across companies.",
    },
    {
      key: "jobs",
      label: "Jobs",
      value: "386",
      helper: "Jobs managed across services.",
    },
    {
      key: "applications",
      label: "Applications",
      value: "8,940",
      helper: "Applications flowing through pipelines.",
    },
  ],
};

export async function getAdminDashboard() {
  await delay(250);
  return adminDashboardData;
}
