import { apiClient } from "./client";

/** Job as returned by the Laravel API (snake_case). */
export interface ApiJob {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  required_skills: string | null;
  domain: string;
  wilaya: string;
  contract_type: string;
  experience_required: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_range: string | null;
  positions: number;
  positions_filled: number;
  positions_left: number;
  status: "active" | "closed";
  has_test: boolean;
  test_id: number | null;
  has_training: boolean;
  compatibility_score: number | null;
  has_applied: boolean;
  is_saved: boolean;
  company?: {
    id: number;
    company_name: string;
    domain: string;
    wilaya: string;
    description?: string | null;
  };
  applications_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiJobsMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

/** Shape of GET /jobs response: { success, data: { data: [...], meta: {...} } } */
export interface JobsResponse {
  success: boolean;
  data: {
    data: ApiJob[];
    meta: ApiJobsMeta;
    links: Record<string, string | null>;
  };
}

/** Shape of GET /jobs/{id} response: { success, data: ApiJob } */
export interface JobResponse {
  success: boolean;
  data: ApiJob;
}

export const jobsApi = {
  // ── Public ────────────────────────────────────────────────────────────────
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<JobsResponse>(`/jobs${qs}`);
  },

  show: (id: number | string) =>
    apiClient.get<JobResponse>(`/jobs/${id}`),

  // ── Company (auth + approved required) ───────────────────────────────────
  companyList: () => apiClient.get<JobsResponse>("/company/jobs"),

  create: (payload: Record<string, unknown>) =>
    apiClient.post<JobResponse>("/company/jobs", payload),

  update: (id: number | string, payload: Record<string, unknown>) =>
    apiClient.put<JobResponse>(`/company/jobs/${id}`, payload),

  remove: (id: number | string) =>
    apiClient.delete<void>(`/company/jobs/${id}`),

  close: (id: number | string) =>
    apiClient.patch<void>(`/company/jobs/${id}/close`),
};

export const savedJobsApi = {
  save: (jobOfferId: number | string) =>
    apiClient.post<void>(`/candidate/saved-jobs/${jobOfferId}`, {}),

  unsave: (jobOfferId: number | string) =>
    apiClient.delete<void>(`/candidate/saved-jobs/${jobOfferId}`),
};
