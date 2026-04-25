import { apiClient } from "./client";

export interface QuizSubmitPayload {
  answers: string[]; // indexed by question order
}

export interface ApiCompanyTraining {
  id: number;
  title: string;
  description: string | null;
  total_duration: number;
  modules_count: number;
  enrolled_count: number;
  created_at: string;
  job_offer: { id: number; title: string; domain: string } | null;
}

export interface ApiTrainingModule {
  id: number;
  title: string;
  type: "video" | "text" | "image" | "file" | "mcq_quiz";
  content: Record<string, unknown> | null;
  duration: number;
  order: number;
}

export interface ApiCompanyTrainingDetail {
  id: number;
  title: string;
  description: string | null;
  total_duration: number;
  enrolled_count: number;
  job_offer: { id: number; title: string; domain: string } | null;
  modules: ApiTrainingModule[];
}

export interface TrainingModulePayload {
  title: string;
  type: "video" | "text" | "image" | "file" | "mcq_quiz";
  content?: unknown;
  duration?: number;
  order?: number;
}

export interface CreateTrainingPayload {
  job_offer_id: number;
  title: string;
  description?: string;
  modules: TrainingModulePayload[];
}

export const trainingsApi = {
  // Candidate
  list: () => apiClient.get<{ data: unknown[] }>("/candidate/trainings"),

  show: (trainingId: number | string) =>
    apiClient.get<{ data: unknown }>(`/candidate/trainings/${trainingId}`),

  confirmOffer: (applicationId: number | string) =>
    apiClient.post<void>(
      `/candidate/trainings/${applicationId}/confirm-offer`,
      {}
    ),

  completeModule: (moduleId: number | string) =>
    apiClient.post<void>(
      `/candidate/training-modules/${moduleId}/complete`,
      {}
    ),

  submitQuiz: (moduleId: number | string, payload: QuizSubmitPayload) =>
    apiClient.post<{ score: number; passed: boolean }>(
      `/candidate/training-modules/${moduleId}/quiz`,
      payload
    ),

  // Company
  companyList: () =>
    apiClient.get<{ data: ApiCompanyTraining[] }>("/company/trainings"),

  companyShow: (trainingId: number | string) =>
    apiClient.get<{ data: ApiCompanyTrainingDetail }>(`/company/trainings/${trainingId}`),

  companyCreate: (payload: CreateTrainingPayload) =>
    apiClient.post<{ data: { id: number; title: string } }>(
      "/company/trainings",
      payload
    ),

  companyUpdate: (
    trainingId: number | string,
    payload: Partial<CreateTrainingPayload>
  ) =>
    apiClient.put<{ data: { id: number; title: string } }>(
      `/company/trainings/${trainingId}`,
      payload
    ),

  companyDelete: (trainingId: number | string) =>
    apiClient.delete<{ success: boolean }>(
      `/company/trainings/${trainingId}`
    ),
};
