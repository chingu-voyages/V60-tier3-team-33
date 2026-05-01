import { Search } from "lucide-react";
import AppList from "../components/AppList";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import type { Application } from "../types/application";
import { api } from "../services/api";
import { cap } from "../utilities/capitalize";

function Boards() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";

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
    try {
      if (editingApp) {
        await api.updateApplication(editingApp.id, data);
      } else {
        await api.createApplication(data);
      }

      const newData = await fetchApplications();
      if (newData) setApplications(newData);

      setIsAddModalOpen(false);
      setEditingApp(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save application");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await api.deleteApplication(id);

      const newData = await fetchApplications();
      if (newData) setApplications(newData);
    } catch (err) {
      console.error(err);
      alert("Failed to delete application");
    }
  };

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div>
            <span className="text-text-muted">
              <NavLink
                to="/boards"
                className="hover:text-text-main transition-colors"
              >
                Boards
              </NavLink>{" "}
              /{" "}
            </span>
            {cap(status || "all")}
          </div>
          <div>
            <span className="pr-3 text-2xl font-bold">
              {cap(status || "all")}
            </span>
            <span className="text-gray-500">{applications.length}</span>
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
            className="bg-primary cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
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
        applications={applications}
        onEdit={(app) => {
          setEditingApp(app);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDelete}
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
