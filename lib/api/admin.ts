import { apiClient } from "./client";

// ── Response shapes from the Laravel AdminController ─────────────────────────

export interface AdminPlatformStats {
  totalCompanies: number;
  approvedCompanies: number;
  pendingCompanies: number;
  rejectedCompanies: number;
  totalCandidates: number;
  totalJobOffers: number;
  activeJobOffers: number;
  closedJobOffers: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

export interface AdminPendingCompany {
  id: number;
  companyName: string;
  activityDomain: string;
  adminEmail: string;
  wilaya: string;
  jobOffersCount: number;
  totalApplications: number;
  status: string;
  registrationDate: string;
}

export interface AdminRecentCandidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  wilaya: string;
  postalCode: string;
  educationLevel: string;
  fieldOfStudy: string;
  yearsOfExperience: number;
  skills: string[];
  createdAt: string;
  profilePhotoUrl?: string | null;
}

export interface AdminDashboardResponse {
  platformStats: AdminPlatformStats;
  pendingCompanies: AdminPendingCompany[];
  recentCandidates: AdminRecentCandidate[];
}

export interface AdminAnalyticsResponse {
  platformStats: AdminPlatformStats;
  monthlyRegistrations: { month: string; candidates: number; companies: number }[];
  applicationsOverTime: { month: string; count: number }[];
  applicationsByDomain: { domain: string; count: number }[];
  topDomains: { domain: string; count: number }[];
  geoDistribution: { wilaya: string; count: number }[];
  applicationFunnel: { total: number; pending: number; accepted: number; rejected: number };
  companyBreakdown: { approved: number; pending: number; rejected: number };
  recentActivity: { date: string; activity: string; count: number }[];
}

export interface AdminCompany {
  id: number;
  companyName: string;
  activityDomain: string;
  adminEmail: string;
  wilaya: string;
  jobOffersCount: number;
  totalApplications: number;
  status: string;
  registrationDate: string;
}

export interface AdminCompanyDetail {
  id: number;
  companyName: string;
  activityDomain: string;
  professionalEmail: string;
  phoneNumber: string;
  website: string | null;
  wilaya: string;
  postalCode: string;
  description: string;
  documents: {
    commercialRegister: { filename: string; url: string; uploadedAt: string } | null;
    nifDocument: { filename: string; url: string; uploadedAt: string } | null;
    additionalDocuments: { filename: string; url: string; uploadedAt: string }[];
  };
  adminFullName: string;
  adminEmail: string;
  status: string;
  registrationDate: string;
  approvedDate: string | null;
  jobOffersCount: number;
  totalApplications: number;
  acceptedCandidates: number;
  adminNote: string | null;
}

export interface AdminCandidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  wilaya: string;
  postalCode: string;
  educationLevel: string;
  fieldOfStudy: string;
  yearsOfExperience: number;
  skills: string[];
  createdAt: string;
  profilePhotoUrl?: string | null;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
  profilePhotoUrl?: string | null;
}

export interface AdminUsersSummary {
  total: number;
  candidates: number;
  companies: number;
  admins: number;
}

export interface AdminJob {
  id: number;
  title: string;
  companyName: string;
  domain: string;
  wilaya: string;
  contractType: string;
  salaryRange: string | null;
  positions: number;
  positions_filled: number;
  status: string;
  applicationsCount: number;
  created_at: string;
}

export interface AdminJobsSummary {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
}

export interface AdminApplication {
  id: number;
  candidateName: string;
  candidateProfilePhotoUrl?: string | null;
  jobTitle: string;
  companyName: string;
  compatibilityScore: number;
  currentStatus: string;
  testStatus: string | null;
  testScore: number | null;
  appliedDate: string;
}

export interface AdminApplicationsSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export interface AdminSettings {
  footerText: string;
  supportEmail: string;
  maxJobsPerCompany: number;
  maxApplicantsPerJob: number;
  notifyNewCompany: boolean;
  notifyNewCandidate: boolean;
}

// ── API functions ─────────────────────────────────────────────────────────────

export const adminApi = {
  async getDashboard(): Promise<AdminDashboardResponse> {
    const res = await apiClient.get<{ success: boolean; data: AdminDashboardResponse }>(
      "/admin/dashboard"
    );
    return res.data;
  },

  async getAnalytics(): Promise<AdminAnalyticsResponse> {
    const res = await apiClient.get<{ success: boolean; data: AdminAnalyticsResponse }>(
      "/admin/analytics"
    );
    return res.data;
  },

  async getCompanies(filters?: {
    status?: string;
    wilaya?: string;
    domain?: string;
    search?: string;
  }): Promise<AdminCompany[]> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.set("status", filters.status);
    if (filters?.wilaya && filters.wilaya !== "all") params.set("wilaya", filters.wilaya);
    if (filters?.domain && filters.domain !== "all") params.set("domain", filters.domain);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    const res = await apiClient.get<{ success: boolean; data: AdminCompany[] }>(
      `/admin/companies${qs ? `?${qs}` : ""}`
    );
    return res.data;
  },

  async getCompany(id: number): Promise<AdminCompanyDetail> {
    const res = await apiClient.get<{ success: boolean; data: AdminCompanyDetail }>(
      `/admin/companies/${id}`
    );
    return res.data;
  },

  async approveCompany(id: number, note?: string): Promise<void> {
    await apiClient.patch(`/admin/companies/${id}/approve`, { note: note ?? null });
  },

  async rejectCompany(id: number, reason?: string): Promise<void> {
    await apiClient.patch(`/admin/companies/${id}/reject`, { reason: reason ?? null });
  },

  async getCandidates(filters?: {
    wilaya?: string;
    domain?: string;
    education?: string;
    search?: string;
  }): Promise<AdminCandidate[]> {
    const params = new URLSearchParams();
    if (filters?.wilaya && filters.wilaya !== "all") params.set("wilaya", filters.wilaya);
    if (filters?.domain && filters.domain !== "all") params.set("domain", filters.domain);
    if (filters?.education && filters.education !== "all") params.set("education", filters.education);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    const res = await apiClient.get<{ success: boolean; data: AdminCandidate[] }>(
      `/admin/candidates${qs ? `?${qs}` : ""}`
    );
    return res.data;
  },

  async getUsers(filters?: {
    role?: string;
    search?: string;
  }): Promise<{ data: AdminUser[]; summary: AdminUsersSummary }> {
    const params = new URLSearchParams();
    if (filters?.role && filters.role !== "all") params.set("role", filters.role);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    const res = await apiClient.get<{
      success: boolean;
      data: AdminUser[];
      summary: AdminUsersSummary;
    }>(`/admin/users${qs ? `?${qs}` : ""}`);
    return { data: res.data, summary: res.summary };
  },

  async suspendUser(id: number): Promise<void> {
    await apiClient.patch(`/admin/users/${id}/suspend`);
  },

  async reactivateUser(id: number): Promise<void> {
    await apiClient.patch(`/admin/users/${id}/reactivate`);
  },

  async getJobs(filters?: {
    domain?: string;
    wilaya?: string;
    search?: string;
  }): Promise<{ data: AdminJob[]; summary: AdminJobsSummary }> {
    const params = new URLSearchParams();
    if (filters?.domain && filters.domain !== "all") params.set("domain", filters.domain);
    if (filters?.wilaya && filters.wilaya !== "all") params.set("wilaya", filters.wilaya);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    const res = await apiClient.get<{
      success: boolean;
      data: AdminJob[];
      summary: AdminJobsSummary;
    }>(`/admin/jobs${qs ? `?${qs}` : ""}`);
    return { data: res.data, summary: res.summary };
  },

  async getSettings(): Promise<AdminSettings> {
    const res = await apiClient.get<{ success: boolean; data: AdminSettings }>("/admin/settings");
    return res.data;
  },

  async updateSettings(data: Partial<AdminSettings>): Promise<void> {
    await apiClient.put("/admin/settings", data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put("/admin/password", { currentPassword, newPassword });
  },

  async getApplications(filters?: {
    status?: string;
    domain?: string;
    search?: string;
  }): Promise<{ data: AdminApplication[]; summary: AdminApplicationsSummary }> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.set("status", filters.status);
    if (filters?.domain && filters.domain !== "all") params.set("domain", filters.domain);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    const res = await apiClient.get<{
      success: boolean;
      data: AdminApplication[];
      summary: AdminApplicationsSummary;
    }>(`/admin/applications${qs ? `?${qs}` : ""}`);
    return { data: res.data, summary: res.summary };
  },
};
