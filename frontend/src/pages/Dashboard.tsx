import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import AppList from "../components/AppList";
import { MetricCard } from "../components/MetricCard";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { formatDate } from "../utilities/formatDate";
import { api } from "../services/api";
import type { Application } from "../types/application";
import type { AnalyticsResponse, InsightsResponse } from "../types/metrics";

function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

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

  const handleSave = async (data: Partial<Application>) => {
    try {
      if (editingApp) {
        await api.updateApplication(editingApp.id, data);
      } else {
        await api.createApplication(data);
      }
      await fetchData();
      setIsAddModalOpen(false);
      setEditingApp(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save application");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.deleteApplication(id);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
    }
  };

  if (isLoading || !analytics || !insights) {
    return <div className="p-5 text-gray-500">Loading dashboard data...</div>;
  }

  const avgResponseDays =
    insights.avg_response_time && insights.avg_response_time.length > 0
      ? Math.round(
          insights.avg_response_time.reduce((acc, curr) => acc + curr.days, 0) /
            insights.avg_response_time.length,
        )
      : 0;

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between py-5 mb-2">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Dashboard</h1>
          <div className="text-text-muted">{formatDate(new Date(), "long")}</div>
        </div>
        <button
          type="button"
          className="bg-primary hover:opacity-90 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold text-black transition-all active:scale-95"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          subtext="of applications"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${avgResponseDays}d`}
          subtext="to first response"
        />
      </div>

      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Applications</h2>
        <div className="flex items-center relative">
          <div className="absolute left-3 text-gray-400">
            <Search size={18} />
          </div>
          <input
            className="bg-surface border border-border h-10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Search..."
          />
        </div>
      </div>

      <AppList 
        boardsView={false} 
        applications={applications} 
        setApplications={setApplications}
        onEdit={(app) => {
          setEditingApp(app);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDelete}
        fetchData={fetchData}
      />

      <ApplicationFormModal
        key={editingApp ? `edit-${editingApp.id}` : `add-${isAddModalOpen}`}
        isOpen={isAddModalOpen}
        mode={editingApp ? "edit" : "add"}
        initialData={editingApp}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}

export default Dashboard;