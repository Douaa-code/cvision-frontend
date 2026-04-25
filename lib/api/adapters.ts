import type { JobOffer, Application } from "@/types";
import type { ApiJob } from "./jobs";

/** Raw application as returned by the Laravel API (snake_case) */
export interface ApiApplication {
  id: number;
  candidate_id: number;
  job_offer_id: number;
  status: "pending" | "accepted" | "rejected";
  compatibility_score: number | null;
  test_status?: "passed" | "failed" | "not_started" | null;
  test_score?: number | null;
  candidate_confirmed_at?: string | null;
  created_at: string;
  updated_at: string;
  candidate?: {
    id: number;
    user?: {
      id: number;
      name: string;
      email: string;
    };
    profile_photo?: string | null;
  };
  job_offer?: {
    id: number;
    title: string;
    company?: { id: number; company_name: string };
  };
}

/** Raw test item as returned by GET /candidate/tests */
export interface ApiCandidateTest {
  application_id: number;
  job_offer_id?: number;
  status: "pending" | "passed" | "failed";
  score?: number | null;
  test: {
    id: number;
    test_name: string;
    description: string;
    duration: number;
    passing_score: number;
    questions_count: number;
    domain: string;
  };
  job_offer?: { title: string };
}

/** Raw training item as returned by GET /candidate/trainings */
export interface ApiTraining {
  id: number;
  title: string;
  description: string;
  position?: string;
  total_videos: number;
  total_courses: number;
  total_hours: number;
  progress: number;
  domain: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: any[];
  created_at: string;
  updated_at: string;
}

/** Adapt an ApiJob (snake_case from Laravel) to the frontend JobOffer type */
export function adaptJob(job: ApiJob): JobOffer {
  return {
    id: String(job.id),
    companyId: String(job.company?.id ?? ""),
    companyName: job.company?.company_name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jobTitle: job.title,
    jobDescription: job.description,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contractType: job.contract_type as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    domain: job.domain as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wilaya: job.wilaya as any,
    postalCode: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    salaryRange: (job.salary_range ?? "") as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experienceRequired: (job.experience_required ?? "") as any,
    companyDescription: job.company?.description ?? undefined,
    maxAcceptedCandidates: job.positions,
    currentAccepted: job.positions_filled,
    requireQCMTest: job.has_test,
    linkedTestId: job.test_id ? String(job.test_id) : undefined,
    status: job.status === "active" ? "Active" : "Closed",
    postedDate: new Date(job.created_at),
    applicationsCount: job.applications_count ?? 0,
    matchPercentage: job.compatibility_score ?? undefined,
    saved: job.is_saved,
    createdAt: new Date(job.created_at),
    updatedAt: new Date(job.updated_at),
  };
}

/** Adapt a raw API application to the frontend Application type */
export function adaptApplication(app: ApiApplication): Application {
  const statusMap = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  } as const;
  const testStatusMap = { passed: "Passed", failed: "Failed", not_started: "Not Started" } as const;

  return {
    id: String(app.id),
    candidateId: String(app.candidate_id),
    candidateName: app.candidate?.user?.name ?? undefined,
    candidatePhotoPath: app.candidate?.profile_photo ?? null,
    jobId: String(app.job_offer?.id ?? app.job_offer_id ?? ""),
    jobTitle: app.job_offer?.title,
    companyId: String(app.job_offer?.company?.id ?? ""),
    companyName: app.job_offer?.company?.company_name,
    appliedDate: new Date(app.created_at),
    currentStatus: statusMap[app.status] ?? "Pending",
    compatibilityScore: app.compatibility_score ?? null,
    testStatus: testStatusMap[app.test_status as keyof typeof testStatusMap] ?? "Not Started",
    testScore: app.test_score ?? undefined,
    confirmedAt: app.candidate_confirmed_at ?? null,
    createdAt: new Date(app.created_at),
    updatedAt: new Date(app.updated_at),
  };
}
