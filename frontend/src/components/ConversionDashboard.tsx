import { type FC, useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { PipelineChart } from './PipelineChart';
import { mockMetricsData, mockPipelineData } from '../mocks/conversionData';
import type { ConversionMetrics, PipelineStage } from '../types/metrics';
import { DonutChart } from './DonutChart';

export const ConversionDashboard: FC = () => {
    const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
    const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            //realdata placeholder, using mockdata
            setMetrics(mockMetricsData);
            setPipeline(mockPipelineData);
            
        } catch (err) {
            setError('Failed to load metrics data. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        };

        fetchMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full p-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-36 bg-gray-200 rounded-xl"></div>
                    <div className="h-36 bg-gray-200 rounded-xl"></div>
                    <div className="h-36 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4">
                <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Insights</h2>
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <MetricCard title="Response Rate" percentage={metrics.responseRate} tooltipText="Total Responses / Total Applications" />
                <MetricCard title="Applied → Interview" percentage={metrics.appliedToInterview} tooltipText="Total Interviews / Total Applications" />
                <MetricCard title="Interview → Offer" percentage={metrics.interviewToOffer} tooltipText="Total Offers / Total Interviews" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
                <div className="lg:col-span-1 h-full">
                    <PipelineChart data={pipeline} total={metrics.totalApplications} />
                </div>

                <div className="lg:col-span-1 h-full">
                    <DonutChart data={pipeline} total={metrics.totalApplications} />
                </div>
                
            </div>
        </div>
    );
};