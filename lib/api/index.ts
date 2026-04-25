export { apiClient } from "./client";
export { adminApi } from "./admin";
export type {
  AdminDashboardResponse, AdminAnalyticsResponse,
  AdminCompany, AdminCompanyDetail, AdminCandidate,
  AdminUser, AdminUsersSummary, AdminJob, AdminJobsSummary,
  AdminApplication, AdminApplicationsSummary, AdminSettings,
} from "./admin";
export { candidateApi } from "./candidate";
export type { ApiCandidateProfile, ApiCandidateSkill, UpdateProfilePayload } from "./candidate";
export { authApi } from "./auth";
export { jobsApi, savedJobsApi } from "./jobs";
export { applicationsApi } from "./applications";
export { testsApi } from "./tests";
export { trainingsApi } from "./trainings";
export { companyApi } from "./company";
export { adaptJob, adaptApplication } from "./adapters";

export type { LoginPayload, AuthUser, AuthResponse } from "./auth";
export type { ApiJob, ApiJobsMeta, JobsResponse, JobResponse } from "./jobs";
export type { TestSubmitPayload, TestResult } from "./tests";
export type { QuizSubmitPayload } from "./trainings";
export type { ApiApplication, ApiCandidateTest, ApiTraining } from "./adapters";
export type { CompanyDashboardStats } from "./company";
