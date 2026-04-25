import { apiClient } from "./client";

export interface ApiCandidateSkill {
  id: number;
  name: string;
}

export interface ApiLanguage {
  name: string;
  level: "Native" | "Fluent" | "Intermediate";
}

export interface ApiCandidateProfile {
  id: number;
  user: { id: number; name: string; email: string };
  phone: string | null;
  wilaya: string | null;
  postal_code: string | null;
  street_address: string | null;
  domain: string | null;
  highest_degree: string | null;
  field_of_study: string | null;
  university: string | null;
  graduation_year: number | null;
  years_of_experience: number | null;
  current_position: string | null;
  current_company: string | null;
  languages: ApiLanguage[];
  profile_photo: string | null;
  certificate_path: string | null;
  skills: ApiCandidateSkill[];
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  wilaya?: string;
  postal_code?: string;
  street_address?: string;
  domain?: string;
  highest_degree?: string;
  field_of_study?: string;
  university?: string;
  graduation_year?: number | null;
  years_of_experience?: number;
  current_position?: string;
  current_company?: string;
  languages?: ApiLanguage[];
}

export const candidateApi = {
  getProfile: () =>
    apiClient.get<{ success: boolean; data: ApiCandidateProfile }>("/candidate/profile"),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<{ success: boolean; data: ApiCandidateProfile }>("/candidate/profile", payload),

  addSkill: (skillName: string) =>
    apiClient.post<{ success: boolean; data: ApiCandidateSkill }>("/candidate/skills", {
      skill_name: skillName,
    }),

  removeSkill: (skillId: number) =>
    apiClient.delete<{ success: boolean }>(`/candidate/skills/${skillId}`),

  submitSeparationRequest: (formData: FormData) =>
    apiClient.post<{ success: boolean; message: string; data: unknown }>(
      "/candidate/separation-requests",
      formData
    ),

  getSeparationRequests: () =>
    apiClient.get<{ success: boolean; data: unknown[] }>("/candidate/separation-requests"),
};
