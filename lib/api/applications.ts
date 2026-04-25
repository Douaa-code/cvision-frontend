import { apiClient } from "./client";

export interface ApiApplicationCandidate {
  id: number;
  user: { id: number; name: string; email: string };
  domain: string | null;
  years_of_experience: string | null;
  highest_degree: string | null;
  skills: string[];
  phone?: string | null;
  wilaya?: string | null;
  postal_code?: string | null;
  street_address?: string | null;
  field_of_study?: string | null;
  university?: string | null;
  graduation_year?: string | null;
  current_position?: string | null;
  current_company?: string | null;
  languages?: { name: string; level: string }[];
  profile_photo?: string | null;
  certificate_path?: string | null;
}

export interface ApiApplicationFull {
  id: number;
  status: "pending" | "accepted" | "rejected";
  test_status: "not_started" | "passed" | "failed" | null;
  test_score: number | null;
  compatibility_score: number;
  applied_at: string | null;
  comment: string | null;
  created_at: string;
  candidate?: ApiApplicationCandidate;
  job_offer?: {
    id: number;
    title: string;
    domain: string;
    wilaya: string;
    contract_type: string;
    status: string;
    company?: { id: number; company_name: string };
  };
}

export const applicationsApi = {
  // ── Candidate ─────────────────────────────────────────────────────────────
  myApplications: () =>
    apiClient.get<{ data: { data: ApiApplicationFull[]; meta: unknown } }>(
      "/candidate/applications"
    ),

  apply: (jobOfferId: number | string) =>
    apiClient.post<{ data: ApiApplicationFull }>(
      `/candidate/applications/${jobOfferId}`,
      {}
    ),

  // ── Company ───────────────────────────────────────────────────────────────
  jobApplications: (jobOfferId: number | string) =>
    apiClient.get<{ data: { data: ApiApplicationFull[]; meta: unknown } }>(
      `/company/jobs/${jobOfferId}/applications`
    ),

  show: (applicationId: number | string) =>
    apiClient.get<{ success: boolean; data: ApiApplicationFull }>(
      `/company/applications/${applicationId}`
    ),

  accept: (applicationId: number | string, comment?: string) =>
    apiClient.patch<void>(`/company/applications/${applicationId}/accept`, { comment: comment ?? null }),

  reject: (applicationId: number | string, comment?: string) =>
    apiClient.patch<void>(`/company/applications/${applicationId}/reject`, { comment: comment ?? null }),

  // ── Candidate — confirm offer ──────────────────────────────────────────────
  confirmOffer: (applicationId: number | string) =>
    apiClient.post<{ success: boolean; message: string }>(`/candidate/trainings/${applicationId}/confirm-offer`, {}),
};
