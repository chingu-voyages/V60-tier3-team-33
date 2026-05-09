import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InsightsOverview from '../components/InsightsOverview';
import { WeeklyApplicationsChart } from '../components/charts/WeeklyApplicationsChart';
import { StatusDistributionChart } from '../components/charts/StatusDistributionChart';
import { TopJobsChart } from '../components/charts/TopJobsChart';
import { AvgResponseTimeChart } from '../components/charts/AvgResponseTimeChart';
import { api } from '../services/api';
import type { AnalyticsResponse, OverviewResponse, InsightsResponse } from '../types/metrics';

export const InsightsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const timeframe = (searchParams.get('timeframe') as 'thisMonth' | 'allTime') || 'thisMonth';
    
    const setTimeframe = (newTimeframe: 'thisMonth' | 'allTime') => {
        setSearchParams({ timeframe: newTimeframe });
    };
    
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [overview, setOverview] = useState<OverviewResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSwitching, setIsSwitching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsightsData = async () => {
            try {
                if (!analytics) {
                    setIsInitialLoading(true);
                } else {
                    setIsSwitching(true);
                }

                const [analyticsData, overviewData, insightsData] = await Promise.all([
                    api.getAnalytics(),
                    api.getOverview(timeframe),
                    api.getInsights(timeframe)
                ]);
                
                setAnalytics(analyticsData);
                setOverview(overviewData);
                setInsights(insightsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred fetching insights.');
            } finally {
                setIsInitialLoading(false);
                setIsSwitching(false);
            }
        };

        fetchInsightsData();
    }, [timeframe]);

    if (isInitialLoading || !analytics || !overview || !insights) {
        return (
             <div className="p-8 font-sans min-h-screen transition-colors">
                <div className="max-w-7xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-[#27272A] w-48 rounded mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-[#18181B] rounded-2xl"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="h-75 bg-gray-200 dark:bg-[#18181B] rounded-2xl"></div>
                        <div className="h-75 bg-gray-200 dark:bg-[#18181B] rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

    const subtitleText = timeframe === 'thisMonth' 
        ? new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
        : 'Lifetime Overview';

    return (
        <div className={`p-8 font-sans transition-all duration-300 ${isSwitching ? 'opacity-50 grayscale-[20%]' : 'opacity-100'}`}>
            <div className="max-w-7xl mx-auto">
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
                        <p className="text-gray-500 dark:text-[#71717A] mt-1">{subtitleText}</p>
                    </div>
                    
                    <div className="flex rounded-[16px] border border-gray-200 dark:border-[#27272A] bg-white dark:bg-[#1A1A1A] p-1 shadow-sm">
                        <button 
                            onClick={() => setTimeframe('thisMonth')}
                            className={`cursor-pointer px-6 py-2 rounded-[12px] text-sm font-medium transition-all ${
                                timeframe === 'thisMonth' 
                                ? 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3F3F46] shadow-sm' 
                                : 'text-gray-500 dark:text-[#71717A] hover:text-gray-900 dark:hover:text-white border border-transparent'
                            }`}
                        >
                            This Month
                        </button>
                        <button 
                            onClick={() => setTimeframe('allTime')}
                            className={`cursor-pointer px-6 py-2 rounded-[12px] text-sm font-medium transition-all ${
                                timeframe === 'allTime' 
                                ? 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3F3F46] shadow-sm' 
                                : 'text-gray-500 dark:text-[#71717A] hover:text-gray-900 dark:hover:text-white border border-transparent'
                            }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>

                <InsightsOverview insights={insights} analytics={analytics} timeframe={timeframe} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <WeeklyApplicationsChart 
                        data={insights.applications_trend} 
                        timeframe={timeframe} 
                    />
                    
                    <StatusDistributionChart byStatus={overview.by_status} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TopJobsChart data={insights.top_job_titles} />
                    
                    <AvgResponseTimeChart 
                        data={insights.avg_response_time} 
                        timeframe={timeframe} 
                    />
                </div>

            </div>
        </div>
    );
};