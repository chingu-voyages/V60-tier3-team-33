import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Application, ApplicationStatus } from '../types/application';
import type { AnalyticsResponse, InsightsResponse } from '../types/metrics';
import { api } from '../services/api';

type DashboardProviderTypes = {
    children: React.ReactNode;
}

type DashboardContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  analytics: AnalyticsResponse | null; 
  insights: InsightsResponse| null;
  isLoading: boolean;
  fetchData: (showLoading?: boolean) => Promise<void>;
  saveApplication: (data: Partial<Application>, id?: number) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
  changeApplicationStatus: (id: number, status: ApplicationStatus) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

function DashboardProvider({children}: DashboardProviderTypes) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);
      
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    try {
      await api.updateApplication(id, { status });
      await fetchData(false);
    } catch (err) {
      console.error("Failed to update status", err);
      throw err;
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
        fetchData,
        saveApplication,
        deleteApplication,
        changeApplicationStatus
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