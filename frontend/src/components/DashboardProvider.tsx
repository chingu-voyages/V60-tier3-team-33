import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Application, ApplicationStatus } from '../types/application';
import type { AnalyticsResponse, InsightsResponse } from '../types/metrics';
import { api } from '../services/api';
import { authService } from '../api/auth';

type DashboardProviderTypes = {
    children: React.ReactNode;
}

import type { DashboardContextType, SavedLink, UploadedFile, UserProfile } from '../types/dashboard';

const DashboardContext = createContext<DashboardContextType | null>(null);

function DashboardProvider({children}: DashboardProviderTypes) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [savedLinks, setSavedLinks] = useState<SavedLink[]>(() => {
      const stored = localStorage.getItem("saved_links");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse saved links", e);
        }
      }
      return [
        {
          id: 1,
          label: "LinkedIn Profile",
          url: "https://linkedin.com/in/yourusername",
        },
        { id: 2, label: "GitHub", url: "https://github.com/yourusername" },
        { id: 3, label: "X", url: "https://x.com/yourusername" },
        { id: 4, label: "Portfolio", url: "https://yourportfolio.com" },
      ];
    });

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
      const stored = localStorage.getItem("uploaded_files");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse uploaded files", e);
        }
      }
      return [];
    });

    useEffect(() => {
      localStorage.setItem("saved_links", JSON.stringify(savedLinks));
    }, [savedLinks]);

    useEffect(() => {
      localStorage.setItem("uploaded_files", JSON.stringify(uploadedFiles));
    }, [uploadedFiles]);

  const fetchData = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const [analyticsData, appsData, insightsData, profileResponse] = await Promise.allSettled([
        api.getAnalytics(),
        api.getApplications(1, 10),
        api.getInsights("thisMonth"),
        authService.getProfile(),
      ]);

      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);
      if (appsData.status === 'fulfilled') {
        setApplications(appsData.value.data);
        setPage(1);
        setHasMore(appsData.value.data.length === 10);
      }
      if (insightsData.status === 'fulfilled') setInsights(insightsData.value);
      
      if (profileResponse.status === 'fulfilled') {
        const userData = profileResponse.value.user || profileResponse.value;
        setUserProfile({
          fullName: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phone_number || "",
          employmentStatus: userData.employment_status || "Unemployed",
        });
      } else {
        // Fallback for profile
        setUserProfile({
          fullName: "Alex Johnson",
          email: "alex@example.com",
          phoneNumber: "+1 (555) 000-0000",
          employmentStatus: "Unemployed",
        });
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);
      
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMoreApplications = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.getApplications(nextPage, 10);
      
      setApplications(prev => {
        const existingIds = new Set(prev.map(app => app.id));
        const newApps = res.data.filter((app: Application) => !existingIds.has(app.id));
        return [...prev, ...newApps];
      });
      
      setPage(nextPage);
      setHasMore(res.data.length === 10);
      
    } catch (err) {
      console.error("Failed to load more applications", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore]);

  const saveApplication = async (data: Partial<Application>, id?: number) => {
    try {
      if (id) {
        await api.updateApplication(id, data);
      } else {
        await api.createApplication(data);
      }
      await fetchData(false);
    } catch (err) {
      console.error("Failed to save application", err);
      throw err;
    }
  };

  const deleteApplication = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      await api.deleteApplication(id);
      await fetchData(false);
    } catch (err) {
      console.error("Failed to delete application", err);
      throw err;
    }
  };

  const changeApplicationStatus = async (id: number, status: ApplicationStatus) => {
    const previousApps = [...applications];
    
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status } : app)
    );

    try {
      await api.updateStatus(id, status);
      
    } catch (err) {
      console.error("Failed to update status", err);
      setApplications(previousApps);
    }
  };


  return (
    <DashboardContext.Provider 
      value={{ 
        applications, 
        setApplications,
        analytics, 
        insights, 
        userProfile,
        setUserProfile,
        isLoading, 
        savedLinks,
        setSavedLinks,
        uploadedFiles,
        setUploadedFiles,
        fetchData,
        saveApplication,
        deleteApplication,
        changeApplicationStatus,
        page,
        hasMore,
        isLoadingMore,
        loadMoreApplications
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("requires DashboardProvider");
  }

  return context;
}

export default DashboardProvider;