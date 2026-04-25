import { apiClient } from "./client";

export interface ApiCompanyProfile {
  id: number;
  user: { id: number; name: string; email: string };
  company_name: string;
  domain: string;
  phone: string | null;
  wilaya: string;
  postal_code: string;
  street_address: string | null;
  description: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  approved_at: string | null;
  created_at: string | null;
  documents: {
    id: number;
    document_type: string;
    file_path: string;
    uploaded_at: string | null;
  }[];
  jobs_count: number;
  total_applications: number;
  accepted_candidates: number;
}

export interface UpdateCompanyProfilePayload {
  name?: string;
  email?: string;
  company_name?: string;
  domain?: string;
  phone?: string;
  wilaya?: string;
  postal_code?: string;
  street_address?: string;
  description?: string;
}

export interface CompanyDashboardData {
  active_jobs_count: number;
  total_applications_count: number;
  pending_reviews_count: number;
  accepted_candidates_count: number;
  recent_applications: unknown[];
  active_jobs_with_stats: unknown[];
}

export const companyApi = {
  dashboard: () =>
    apiClient.get<{ success: boolean; data: CompanyDashboardData }>(
      "/company/dashboard"
    ),

  getProfile: () =>
    apiClient.get<{ success: boolean; data: ApiCompanyProfile }>(
      "/company/profile"
    ),

  updateProfile: (payload: UpdateCompanyProfilePayload) =>
    apiClient.put<{ success: boolean; data: ApiCompanyProfile }>(
      "/company/profile",
      payload
    ),

  submitAd: (formData: FormData) =>
    apiClient.post<{ success: boolean; message: string; data: unknown }>(
      "/company/ads",
      formData
    ),
};
