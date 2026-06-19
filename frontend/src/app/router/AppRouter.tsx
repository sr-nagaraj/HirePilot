import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { PublicLayout } from "../../layouts/PublicLayout";
import { PageLoader } from "../../shared/components/PageLoader";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import { PublicOnlyRoute } from "../../shared/components/PublicOnlyRoute";
import { RouteErrorPage } from "../../shared/components/RouteErrorPage";
import { ROUTES } from "../../shared/constants/routes";

const ResumeScorePage = lazy(() =>
    import("../../features/resume-score/pages/ResumeScorePage").then((module) => ({
      default: module.ResumeScorePage,
    }))
);

const LandingPage = lazy(() =>
  import("../../features/auth/pages/LandingPage").then((module) => ({
    default: module.LandingPage,
  })),
);
const LoginPage = lazy(() =>
  import("../../features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const OAuthSuccessPage = lazy(() =>
  import("../../features/auth/pages/OAuthSuccessPage").then((module) => ({
    default: module.OAuthSuccessPage,
  })),
);
const OAuthRoleSelectionPage = lazy(() =>
  import("../../features/auth/pages/OAuthRoleSelectionPage").then((module) => ({
    default: module.OAuthRoleSelectionPage,
  })),
);
const RegisterPage = lazy(() =>
  import("../../features/auth/pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("../../features/auth/pages/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const UnauthorizedPage = lazy(() =>
  import("../../features/auth/pages/UnauthorizedPage").then((module) => ({
    default: module.UnauthorizedPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("../../features/auth/pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const CandidateDashboardPage = lazy(() =>
  import("../../features/candidate/pages/CandidateDashboardPage").then((module) => ({
    default: module.CandidateDashboardPage,
  })),
);
const ApplicationsPage = lazy(() =>
  import("../../features/candidate/pages/ApplicationsPage").then((module) => ({
    default: module.ApplicationsPage,
  })),
);
const ProfilePage = lazy(() =>
  import("../../features/profile/pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);
const ResumePage = lazy(() =>
  import("../../features/resume/pages/ResumePage").then((module) => ({
    default: module.ResumePage,
  })),
);

const JobsPage = lazy(() =>
  import("../../features/jobs/pages/JobsPage").then((module) => ({
    default: module.JobsPage,
  })),
);
const JobDetailsPage = lazy(() =>
  import("../../features/jobs/pages/JobDetailsPage").then((module) => ({
    default: module.JobDetailsPage,
  })),
);
const RecruiterDashboardPage = lazy(() =>
  import("../../features/recruiter/pages/RecruiterDashboardPage").then((module) => ({
    default: module.RecruiterDashboardPage,
  })),
);
const RecruiterJobsPage = lazy(() =>
  import("../../features/recruiter/pages/RecruiterJobsPage").then((module) => ({
    default: module.RecruiterJobsPage,
  })),
);
const CreateJobPage = lazy(() =>
  import("../../features/recruiter/pages/CreateJobPage").then((module) => ({
    default: module.CreateJobPage,
  })),
);
const RecruiterJobDetailsPage = lazy(() =>
  import("../../features/recruiter/pages/RecruiterJobDetailsPage").then((module) => ({
    default: module.RecruiterJobDetailsPage,
  })),
);
const EditJobPage = lazy(() =>
  import("../../features/recruiter/pages/EditJobPage").then((module) => ({
    default: module.EditJobPage,
  })),
);
const RecruiterApplicantsPage = lazy(() =>
  import("../../features/recruiter/pages/RecruiterApplicantsPage").then((module) => ({
    default: module.RecruiterApplicantsPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("../../features/admin/pages/AdminDashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  })),
);

function withPageLoader(node: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: withPageLoader(<LandingPage />),
      },
      {
        path: ROUTES.LOGIN.slice(1),
        element: (
          <PublicOnlyRoute>
            {withPageLoader(<LoginPage />)}
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.OAUTH_SUCCESS.slice(1),
        element: withPageLoader(<OAuthSuccessPage />),
      },
      {
        path: ROUTES.OAUTH_ROLE_SELECTION.slice(1),
        element: withPageLoader(<OAuthRoleSelectionPage />),
      },
      {
        path: ROUTES.REGISTER.slice(1),
        element: (
          <PublicOnlyRoute>
            {withPageLoader(<RegisterPage />)}
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD.slice(1),
        element: (
          <PublicOnlyRoute>
            {withPageLoader(<ForgotPasswordPage />)}
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.UNAUTHORIZED.slice(1),
        element: withPageLoader(<UnauthorizedPage />),
      },
      {
        path: ROUTES.NOT_FOUND.slice(1),
        element: withPageLoader(<NotFoundPage />),
      },
    ],
  },
  {
    path: ROUTES.CANDIDATE_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={["CANDIDATE"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: withPageLoader(<CandidateDashboardPage />),
      },
      {
        path: "profile",
        element: withPageLoader(<ProfilePage />),
      },
      {
        path: "resumes",
        element: withPageLoader(<ResumePage />),
      },
      {
        path: "jobs",
        element: withPageLoader(<JobsPage />),
      },
      {
        path: "jobs/:jobId",
        element: withPageLoader(<JobDetailsPage />),
      },
      {
        path: "applications",
        element: withPageLoader(<ApplicationsPage />),
      },
    ],
  },
  {
    path: ROUTES.RESUME_SCORE,
    element: (
      <ProtectedRoute allowedRoles={["CANDIDATE"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: withPageLoader(<ResumeScorePage />),
      },
    ],
  },
  {
    path: "recruiter",
    element: (
      <ProtectedRoute allowedRoles={["RECRUITER"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: withPageLoader(<RecruiterDashboardPage />),
      },
      {
        path: "profile",
        element: withPageLoader(<ProfilePage />),
      },
      {
        path: "jobs",
        element: withPageLoader(<RecruiterJobsPage />),
      },
      {
        path: "jobs/create",
        element: withPageLoader(<CreateJobPage />),
      },
      {
        path: "jobs/:jobId",
        element: withPageLoader(<RecruiterJobDetailsPage />),
      },
      {
        path: "jobs/:jobId/edit",
        element: withPageLoader(<EditJobPage />),
      },
      {
        path: "jobs/:jobId/applicants",
        element: withPageLoader(<RecruiterApplicantsPage />),
      },
    ],
  },
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: withPageLoader(<AdminDashboardPage />),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
