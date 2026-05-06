import type { Application, ApplicationStatus } from './application';
import type { AnalyticsResponse, InsightsResponse } from './metrics';

export interface SavedLink {
  id: number;
  label: string;
  url: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  date: string;
}

export type DashboardContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  analytics: AnalyticsResponse | null; 
  insights: InsightsResponse | null;
  isLoading: boolean;
  savedLinks: SavedLink[];
  setSavedLinks: React.Dispatch<React.SetStateAction<SavedLink[]>>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  fetchData: (showLoading?: boolean) => Promise<void>;
  saveApplication: (data: Partial<Application>, id?: number) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
  changeApplicationStatus: (id: number, status: ApplicationStatus) => Promise<void>;
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreApplications: () => Promise<void>;
};
