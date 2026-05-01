import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Application } from '../types/application';
import type { AnalyticsResponse, InsightsResponse } from '../types/metrics';
import { api } from '../services/api';

type DashboardProviderTypes = {
    children: React.ReactNode;
}

type DashboardContextType = {
  applications: Application[];
  analytics: AnalyticsResponse | null; 
  insights: InsightsResponse| null;
  isLoading: boolean;
  fetchData: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

function DashboardProvider({children}: DashboardProviderTypes) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

      const fetchData = useCallback(async () => {
          try {
            setIsLoading(true);
            const [analyticsData, appsData, insightsData] = await Promise.all([
              api.getAnalytics(),
              api.getApplications(1, 10),
              api.getInsights("allTime"),
            ]);
      
            setAnalytics(analyticsData);
            setApplications(appsData.data);
            setInsights(insightsData);
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }, []);
      
        useEffect(() => {
          fetchData();
        }, [fetchData]);


  return (
    <DashboardContext.Provider value={{applications, analytics, insights, isLoading, fetchData}}>{children}</DashboardContext.Provider>
  )
}

export function useDashboard() {
    const context= useContext(DashboardContext);

    if(!context){
        throw new Error("requires DashboardProvider")
    }

    return context;
}

export default DashboardProvider;