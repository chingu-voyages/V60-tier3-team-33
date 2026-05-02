import type {
  AnalyticsResponse,
  OverviewResponse,
  InsightsResponse,
} from "../types/metrics";
import type { Application, PaginatedApplications, ApplicationStatus } from "../types/application";
import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "https://jobtracker-api.afuwapetunde.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

export const api = {
  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const response = await apiClient.get<AnalyticsResponse>('/analytics');
    return response.data;
  },

  getApplications: async (
    page = 1,
    perPage = 10,
    search?: string,
    status?: string,
  ): Promise<PaginatedApplications> => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(search && { search }),
      ...(status && { status }),
    });
    const response = await apiClient.get<PaginatedApplications>(`/applications?${params}`);
    return response.data;
  },

  createApplication: async (
    data: Partial<Application>,
  ): Promise<{ message: string; data: Application }> => {
    const response = await apiClient.post<{ message: string; data: Application }>('/applications', data);
    return response.data;
  },

  updateApplication: async (
    id: number,
    data: Partial<Application>,
  ): Promise<{ message: string; data: Application }> => {
    const response = await apiClient.patch<{ message: string; data: Application }>(`/applications/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: number,
    status: ApplicationStatus,
  ): Promise<{ message: string; data: Application }> => {
    const response = await apiClient.patch<{ message: string; data: Application }>(`/applications/${id}/status`, { status });
    return response.data;
  },

  deleteApplication: async (id: number): Promise<void> => {
    await apiClient.delete(`/applications/${id}`);
  },

  getOverview: async (
    timeframe: "thisMonth" | "allTime" = "thisMonth",
  ): Promise<OverviewResponse> => {
    const params = new URLSearchParams({ timeframe });
    const response = await apiClient.get<OverviewResponse>(`/overview?${params}`);
    return response.data;
  },

  getInsights: async (
    timeframe: "thisMonth" | "allTime" = "thisMonth",
  ): Promise<InsightsResponse> => {
    const params = new URLSearchParams({ timeframe });
    const response = await apiClient.get<InsightsResponse>(`/insights?${params}`);
    return response.data;
  },
};
