import { type FC, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from './MetricCard';
import { ApplicationFormModal } from './ApplicationFormModal';
import { ApplicationCardModal } from './ApplicationCardModal';
import type { AnalyticsResponse } from '../types/metrics';
import type { Application } from '../types/application';
import { api } from '../services/api';

export const ConversionDashboard: FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [analyticsData, appsData] = await Promise.all([
                api.getAnalytics(),
                api.getApplications(1, 5)
            ]);
            
            setAnalytics(analyticsData);
            setApplications(appsData.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (data: Partial<Application>) => {
        try {
            if (selectedApp) {
                await api.updateApplication(selectedApp.id, data);
            } else {
                await api.createApplication(data);
            }
            await fetchData();
            setIsAddModalOpen(false);
            setIsCardModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save application");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteApplication(id);
            await fetchData();
            setIsCardModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to delete application");
        }
    };

    if (isLoading || !analytics) {
        return (
             <div className="w-full p-8 font-sans min-h-screen">
                <div className="max-w-7xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-[#27272A] w-48 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-[#18181B] rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-8">Error: {error}</div>;
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'interviewing':
            case 'screening': return 'bg-[#D4FA31]/10 text-gray-800 dark:text-[#D4FA31] border-gray-300 dark:border-[#D4FA31]/20';
            case 'offer_received':
            case 'accepted': return 'bg-green-100 dark:bg-emerald-500/10 text-green-800 dark:text-emerald-400 border-green-200 dark:border-emerald-500/20';
            case 'rejected':
            case 'withdrawn': return 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20';
            default: return 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-300 border-gray-200 dark:border-zinc-700';
        }
    };

    return (
        <div className="w-full p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Insights</h2>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/insights" 
                            className="group flex items-center gap-1.5 text-indigo-600 dark:text-[#D4FA31] hover:text-indigo-500 dark:hover:text-[#e1f961] transition-colors text-sm font-medium"
                        >
                            View all 
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </Link>

                        <button 
                            onClick={() => { setSelectedApp(null); setIsAddModalOpen(true); }}
                            className="bg-indigo-600 dark:bg-[#D4FA31] text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-[#e1f961] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-[#D4FA31]/50 focus:ring-offset-2 dark:focus:ring-offset-[#09090B]"
                        >
                            + Add
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        title="Total Applications" 
                        value={analytics.counts.total_applications.toString()}
                        subtext="active tracking" 
                    />
                </div>

                <ApplicationFormModal 
                    isOpen={isAddModalOpen}
                    mode={selectedApp ? 'edit' : 'add'}
                    initialData={selectedApp}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleSave}
                />

                <ApplicationCardModal 
                    isOpen={isCardModalOpen}
                    application={selectedApp}
                    onClose={() => setIsCardModalOpen(false)}
                    onEdit={() => { setIsCardModalOpen(false); setIsAddModalOpen(true); }}
                    onDelete={() => selectedApp && handleDelete(selectedApp.id)}
                />
                
                {/* <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#27272A] rounded-2xl overflow-hidden transition-colors">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-[#A1A1AA]">
                            <thead className="bg-gray-50 dark:bg-[#18181B] border-b border-gray-200 dark:border-[#27272A] text-xs uppercase text-gray-500 dark:text-[#71717A] transition-colors">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Company</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#27272A]">
                                {applications.map((app) => (
                                    <tr 
                                        key={app.id} 
                                        onClick={() => { setSelectedApp(app); setIsCardModalOpen(true); }}
                                        className="hover:bg-gray-50 dark:hover:bg-[#18181B] transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.company_name}</td>
                                        <td className="px-6 py-4">{app.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getStatusStyles(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-[#A1A1AA]">
                                            No recent applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div> */}
            </div>
        </div>
    );
};