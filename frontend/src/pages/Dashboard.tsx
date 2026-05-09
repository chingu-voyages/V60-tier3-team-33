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
  const [searchQuery, setSearchQuery] = useState("");

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
    return (
      <div className="p-5 max-w-7xl mx-auto animate-pulse min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between py-5 mb-2">
          <div>
            <div className="h-9 bg-gray-200 dark:bg-[#27272A] w-48 rounded mb-2"></div>
            <div className="h-4 bg-gray-100 dark:bg-[#18181B] w-32 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-[#27272A] w-40 rounded-xl"></div>
        </div>

        {/* StatsOverview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-[#1A1A1A] rounded-2xl"></div>
          ))}
        </div>

        {/* Insights Section Skeleton */}
        <div className="mt-10 mb-4 flex justify-between items-end">
          <div className="h-7 bg-gray-200 dark:bg-[#27272A] w-32 rounded"></div>
          <div className="h-4 bg-gray-100 dark:bg-[#18181B] w-20 rounded"></div>
        </div>
        <div className="h-32 bg-gray-200 dark:bg-[#1A1A1A] rounded-2xl mb-8"></div>

        {/* Applications Section Skeleton */}
        <div className="mt-10 mb-4 flex items-center justify-between">
          <div className="h-7 bg-gray-200 dark:bg-[#27272A] w-40 rounded"></div>
          <div className="h-10 bg-gray-100 dark:bg-[#18181B] w-64 rounded-xl"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-100 dark:border-[#27272A] overflow-hidden">
          <div className="h-12 bg-gray-50 dark:bg-[#1E1E20] border-b border-gray-100 dark:border-[#27272A]"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-gray-50 dark:border-[#27272A]/50 last:border-0"></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredAndSortedApplications = [...applications]
    .filter(app => {
      const query = searchQuery.toLowerCase();
      return (
        app.company_name.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <AppList 
        boardsView={false} 
        applications={filteredAndSortedApplications} 
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