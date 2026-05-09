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

export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  employmentStatus: string;
  notificationSettings?: {
    application_reminders: { push: boolean; email: boolean };
    interview_reminders: { push: boolean; email: boolean };
    weekly_summary: { push: boolean; email: boolean };
  };
}

export type DashboardContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  analytics: AnalyticsResponse | null; 
  insights: InsightsResponse | null;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoading: boolean;
  savedLinks: SavedLink[];
  setSavedLinks: React.Dispatch<React.SetStateAction<SavedLink[]>>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  fetchData: (showLoading?: boolean) => Promise<void>;
  saveApplication: (data: Partial<Application>, id?: number) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
  changeApplicationStatus: (id: number, status: ApplicationStatus) => Promise<void>;
  addSavedLink: (label: string, url: string) => Promise<void>;
  editSavedLink: (id: number | string, label: string, url: string) => Promise<void>;
  removeSavedLink: (id: number | string) => Promise<void>;
  uploadNewDocument: (file: File) => Promise<void>;
  removeDocument: (id: number | string) => Promise<void>;
  updateUserPersonalInfo: (data: Partial<UserProfile>) => Promise<void>;
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreApplications: () => Promise<void>;
};
