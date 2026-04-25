import { apiClient } from "./client";

export interface ApiConversation {
  id: number;
  subject: string;
  company_id: number;
  company_name: string;
  candidate_id: number;
  candidate_name: string;
  candidate_photo_url?: string | null;
  job_title: string | null;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
}

export interface ApiMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  body: string;
  is_read: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
}

export const conversationsApi = {
  // Company
  companyList: () =>
    apiClient.get<{ data: ApiConversation[] }>("/company/conversations"),

  companyStart: (payload: {
    candidate_id: number;
    job_offer_id?: number;
    subject: string;
    body?: string;
  }) =>
    apiClient.post<{ data: { conversation_id: number } }>(
      "/company/conversations",
      payload
    ),

  companyMessages: (conversationId: number | string) =>
    apiClient.get<{ data: ApiMessage[] }>(
      `/company/conversations/${conversationId}/messages`
    ),

  companySend: (conversationId: number | string, body: string, file?: File) => {
    if (file) {
      const fd = new FormData();
      if (body.trim()) fd.append("body", body);
      fd.append("attachment", file);
      return apiClient.post<{ data: ApiMessage }>(`/company/conversations/${conversationId}/messages`, fd);
    }
    return apiClient.post<{ data: ApiMessage }>(`/company/conversations/${conversationId}/messages`, { body });
  },

  companyMarkRead: (conversationId: number | string) =>
    apiClient.post<{ success: boolean }>(
      `/company/conversations/${conversationId}/read`,
      {}
    ),

  // Candidate
  candidateList: () =>
    apiClient.get<{ data: ApiConversation[] }>("/candidate/conversations"),

  candidateMessages: (conversationId: number | string) =>
    apiClient.get<{ data: ApiMessage[] }>(
      `/candidate/conversations/${conversationId}/messages`
    ),

  candidateSend: (conversationId: number | string, body: string, file?: File) => {
    if (file) {
      const fd = new FormData();
      if (body.trim()) fd.append("body", body);
      fd.append("attachment", file);
      return apiClient.post<{ data: ApiMessage }>(`/candidate/conversations/${conversationId}/messages`, fd);
    }
    return apiClient.post<{ data: ApiMessage }>(`/candidate/conversations/${conversationId}/messages`, { body });
  },

  candidateMarkRead: (conversationId: number | string) =>
    apiClient.post<{ success: boolean }>(
      `/candidate/conversations/${conversationId}/read`,
      {}
    ),
};
