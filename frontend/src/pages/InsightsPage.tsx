import { useState, useEffect } from 'react';
import { MetricCard } from '../components/MetricCard';
import { WeeklyApplicationsChart } from '../components/charts/WeeklyApplicationsChart';
import { StatusDistributionChart } from '../components/charts/StatusDistributionChart';
import { TopJobsChart } from '../components/charts/TopJobsChart';
import { AvgResponseTimeChart } from '../components/charts/AvgResponseTimeChart';
import { api } from '../services/api';
import type { AnalyticsResponse, OverviewResponse, InsightsResponse } from '../types/metrics';

export const InsightsPage = () => {
    const [timeframe, setTimeframe] = useState<'thisMonth' | 'allTime'>('thisMonth');
    
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [overview, setOverview] = useState<OverviewResponse | null>(null);
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsightsData = async () => {
            try {
                setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchInsightsData();
    }, [timeframe]);

    if (isLoading || !analytics || !overview || !insights) {
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
                        <div className="h-[300px] bg-gray-200 dark:bg-[#18181B] rounded-2xl"></div>
                        <div className="h-[300px] bg-gray-200 dark:bg-[#18181B] rounded-2xl"></div>
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
        <div className="p-8 font-sans transition-colors">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
                        <p className="text-gray-500 dark:text-[#71717A] mt-1">{subtitleText}</p>
                    </div>
                    
                    <div className="flex bg-gray-100 dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg p-1">
                        <button 
                            onClick={() => setTimeframe('thisMonth')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                timeframe === 'thisMonth' 
                                ? 'bg-white dark:bg-[#27272A] text-gray-900 dark:text-white shadow-sm dark:shadow-none' 
                                : 'text-gray-500 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            This Month
                        </button>
                        <button 
                            onClick={() => setTimeframe('allTime')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                timeframe === 'allTime' 
                                ? 'bg-white dark:bg-[#27272A] text-gray-900 dark:text-white shadow-sm dark:shadow-none' 
                                : 'text-gray-500 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard 
                        title="Applied → Interview" 
                        value={`${analytics.conversions.applied_to_interview_percent}%`} 
                        subtext={`${analytics.counts.interview_applications} of ${analytics.counts.total_applications}`} 
                    />
                    <MetricCard 
                        title="Interview → Offer" 
                        value={`${analytics.conversions.interview_to_offer_percent}%`} 
                        subtext={`${analytics.counts.offer_applications} offers`} 
                    />
                    <MetricCard 
                        title="Response Rate" 
                        value={`${analytics.conversions.response_rate_percent}%`} 
                        subtext="of total applied" 
                    />
                    <MetricCard 
                        title="Velocity (This Month)" 
                        value={`${overview.velocity.this_month}`} 
                        subtext={`${overview.velocity.this_week} this week`} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <WeeklyApplicationsChart data={insights.weekly_applications} />
                    
                    <StatusDistributionChart 
                        appliedCount={overview.total_count} 
                        interviewCount={
                            overview.by_status.screening + 
                            overview.by_status.interviewing + 
                            overview.by_status.offer_received + 
                            overview.by_status.accepted
                        } 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TopJobsChart data={insights.top_job_titles} />
                    <AvgResponseTimeChart data={insights.avg_response_time} />
                </div>

            </div>
        </div>
    );
};