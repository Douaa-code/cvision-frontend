import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "company" | "candidate";
  candidate?: { profile_photo?: string | null } | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/login", payload),

  registerCandidate: (payload: Record<string, unknown>) =>
    apiClient.post<AuthResponse>("/register/candidate", payload),

  registerCompany: (payload: FormData) =>
    apiClient.post<AuthResponse>("/register/company", payload),

  me: () => apiClient.get<{ user: AuthUser }>("/me"),

  logout: () => apiClient.post<void>("/logout", {}),
};
