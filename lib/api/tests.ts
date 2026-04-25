import { apiClient } from "./client";

export interface TestSubmitPayload {
  answers: Record<string, string>; // question_id → "A"|"B"|"C"|"D"
}

export interface TestResult {
  score: number;
  passed: boolean;
  test_status: string;
}

export interface ApiCompanyTest {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  passing_score: number;
  questions_count: number;
  created_at: string;
  job_offer: { id: number; title: string; domain: string } | null;
  stats: { total_taken: number; total_passed: number };
}

export interface ApiTestQuestion {
  id: number;
  question_text: string;
  options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct_answer: "A" | "B" | "C" | "D";
  order: number;
}

export interface ApiCompanyTestDetail extends Omit<ApiCompanyTest, "questions_count"> {
  questions: ApiTestQuestion[];
}

export interface CreateTestPayload {
  job_offer_id: number;
  title: string;
  description?: string;
  duration: number;
  passing_score: number;
  questions: {
    question_text: string;
    options: { id: "A" | "B" | "C" | "D"; text: string }[];
    correct_answer: "A" | "B" | "C" | "D";
  }[];
}

export const testsApi = {
  // Candidate
  list: () => apiClient.get<{ data: unknown }>("/candidate/tests"),

  submit: (applicationId: number | string, payload: TestSubmitPayload) =>
    apiClient.post<{ data: TestResult }>(
      `/candidate/tests/${applicationId}/submit`,
      payload
    ),

  // Company
  companyList: () =>
    apiClient.get<{ data: ApiCompanyTest[] }>("/company/tests"),

  companyShow: (testId: number | string) =>
    apiClient.get<{ data: ApiCompanyTestDetail }>(`/company/tests/${testId}`),

  companyCreate: (payload: CreateTestPayload) =>
    apiClient.post<{ data: { id: number; title: string } }>(
      "/company/tests",
      payload
    ),

  companyUpdate: (
    testId: number | string,
    payload: Partial<CreateTestPayload>
  ) =>
    apiClient.put<{ data: { id: number; title: string } }>(
      `/company/tests/${testId}`,
      payload
    ),

  companyDelete: (testId: number | string) =>
    apiClient.delete<{ success: boolean }>(`/company/tests/${testId}`),
};
