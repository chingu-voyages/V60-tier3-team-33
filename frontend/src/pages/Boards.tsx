import { Search } from "lucide-react";
import AppList from "../components/AppList";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { Application, ApplicationStatus } from "../types/application";
import { api } from "../services/api";
import { cap } from "../utilities/capitalize";
import { useDashboard } from "../components/DashboardProvider";

function Boards() {
  const { saveApplication, deleteApplication, changeApplicationStatus } = useDashboard();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";
  const favorites = searchParams.get("favorites") || null;

  /** Friendly labels for raw status values */
  const statusLabels: Record<string, string> = {
    all: "All",
    applied: "Applied",
    screening: "Screening",
    interviewing: "Interviewed",
    offer_received: "Offer",
    accepted: "Accepted",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };
  const displayLabel = (favorites && "Favorites") || statusLabels[status] || cap(status);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await api.getApplications(
        1,
        10,
        search,
        status === "all" ? undefined : status,
      );
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [status, search]);

  useEffect(() => {
    let ignore = false;

    fetchApplications().then((data) => {
      if (data && !ignore) {
        setApplications(data);
      }
    });

    return () => {
      ignore = true;
    };
  }, [fetchApplications]);

  const handleSave = async (data: Partial<Application>) => {
    await saveApplication(data, editingApp?.id);
    const newData = await fetchApplications();
    if (newData) setApplications(newData);
    setIsAddModalOpen(false);
    setEditingApp(null);
  };

  const handleDelete = async (id: number) => {
    await deleteApplication(id);
    const newData = await fetchApplications();
    if (newData) setApplications(newData);
  };

  const filteredApps = useMemo(() => {
    let result = applications;
    
    if (favorites) {
      result = result.filter((app) => app.favorite);
    }
    
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(app => 
        app.company_name.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [applications, searchParams, search, favorites]);

  const handleStatusUpdate = async (id: number, status: ApplicationStatus) => {
    await changeApplicationStatus(id, status);
    const newData = await fetchApplications();
    if (newData) setApplications(newData);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-1">
            <NavLink
              to="/boards"
              className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
            >
              Boards
            </NavLink>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{displayLabel}</span>
          </nav>
          {/* Title + Count */}
          <div className="flex items-baseline gap-2">
            <h1 className="text-[30px] font-bold text-white leading-9 tracking-tight">
              {displayLabel}
            </h1>
            <span className="text-[22px] font-normal text-gray-500">{filteredApps.length}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex items-center">
            <div className="text-text-muted absolute left-3">
              <Search size={18} />
            </div>
            <input
              className="bg-surface border-border text-text-main focus:border-primary h-10 w-64 rounded-xl border pr-4 pl-10 text-sm transition-colors focus:outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
            onClick={() => {
              setEditingApp(null);
              setIsAddModalOpen(true);
            }}
          >
            + Add
          </button>
        </div>
      </div>

      <AppList
        boardsView={true}
        applications={filteredApps}
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

export default Boards;
