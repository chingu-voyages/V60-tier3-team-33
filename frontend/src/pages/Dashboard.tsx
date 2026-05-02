import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import AppList from "../components/AppList";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { formatDate } from "../utilities/formatDate";
import { api } from "../services/api";
import type { Application, ApplicationStatus } from "../types/application";
import StatsOverview from "../components/StatsOverview";
import { useDashboard } from "../components/DashboardProvider";
import InsightsOverview from "../components/InsightsOverview";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const {applications, setApplications, analytics, insights, isLoading, fetchData} = useDashboard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

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

  const handleStatusUpdate = async (id: number, status: ApplicationStatus) => {
    try {
      await api.updateStatus(id, status);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (isLoading || !analytics || !insights) {
    return <div className="p-5 text-gray-500">Loading dashboard data...</div>;
  }

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

<StatsOverview applications={applications}/>
<div className="flex justify-between items-center">
  <h2 className="mt-8 mb-4 text-xl font-semibold">Insights</h2>
  <NavLink to="/insights" className="text-xs flex items-center gap-1 text-primary hover:underline">View All <ArrowUpRight size={12}/></NavLink>
</div>
<InsightsOverview insights={insights} analytics={analytics} />

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
        onStatusUpdate={handleStatusUpdate}
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