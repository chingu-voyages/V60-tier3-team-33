import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Application, ApplicationStatus } from '../types/application';
import type { AnalyticsResponse, InsightsResponse } from '../types/metrics';
import { api } from '../services/api';

type DashboardProviderTypes = {
    children: React.ReactNode;
}

export interface SavedLink {
  id: number;
  label: string;
  url: string;
}

type DashboardContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  analytics: AnalyticsResponse | null; 
  insights: InsightsResponse | null;
  isLoading: boolean;
  savedLinks: SavedLink[];
  setSavedLinks: React.Dispatch<React.SetStateAction<SavedLink[]>>;
  fetchData: (showLoading?: boolean) => Promise<void>;
  saveApplication: (data: Partial<Application>, id?: number) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
  changeApplicationStatus: (id: number, status: ApplicationStatus) => Promise<void>;
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreApplications: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

function DashboardProvider({children}: DashboardProviderTypes) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
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

    useEffect(() => {
      localStorage.setItem("saved_links", JSON.stringify(savedLinks));
    }, [savedLinks]);

  const fetchData = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const [analyticsData, appsData, insightsData] = await Promise.all([
        api.getAnalytics(),
        api.getApplications(1, 10),
        api.getInsights("thisMonth"),
      ]);

      setAnalytics(analyticsData);
      setApplications(appsData.data);
      setInsights(insightsData);
      
      setPage(1);
      setHasMore(appsData.data.length === 10);
      
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
        isLoading, 
        savedLinks,
        setSavedLinks,
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