import { useState, useRef, useCallback } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import AppList from "../components/AppList";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { formatDate } from "../utilities/formatDate";
import type { Application } from "../types/application";
import StatsOverview from "../components/StatsOverview";
import { useDashboard } from "../components/DashboardProvider";
import InsightsOverview from "../components/InsightsOverview";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const { 
    applications, 
    setApplications,
    analytics, 
    insights, 
    isLoading, 
    saveApplication, 
    deleteApplication, 
    changeApplicationStatus,
    hasMore,
    isLoadingMore,
    loadMoreApplications
  } = useDashboard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreApplications();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, loadMoreApplications]);

  const handleSave = async (data: Partial<Application>) => {
    await saveApplication(data, editingApp?.id);
    setIsAddModalOpen(false);
    setEditingApp(null);
  };

  if (isLoading || !analytics || !insights) {
    return <div className="p-5 text-gray-500">Loading dashboard data...</div>;
  }

  const sortedApplications = [...applications].sort((a, b) => {
    return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
  });

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between py-5 mb-2">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Dashboard</h1>
          <div className="text-text-muted">{formatDate(new Date(), "long")}</div>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Application
        </button>
      </div>

      <StatsOverview applications={applications}/>
      
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold">Insights</h2>
        <NavLink to="/insights" className="text-xs flex items-center gap-1 text-primary hover:underline">
            View All <ArrowUpRight size={12}/>
        </NavLink>
      </div>
      
      <InsightsOverview insights={insights} analytics={analytics} timeframe="thisMonth" />

      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Applications</h2>
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
        applications={sortedApplications} 
        setApplications={setApplications}
        onEdit={(app) => {
          setEditingApp(app);
          setIsAddModalOpen(true);
        }}
        onDelete={deleteApplication}
        onStatusUpdate={changeApplicationStatus}
      />

      <div ref={lastElementRef} className="h-4 w-full" />
      {isLoadingMore && (
        <div className="text-center py-4 text-sm text-text-muted">
          Loading more applications...
        </div>
      )}

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