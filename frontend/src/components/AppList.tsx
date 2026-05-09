import { useState } from "react";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";
import type { Application, ApplicationStatus } from "../types/application";
import { Star } from "lucide-react";
import { getStatusStyles } from "../utilities/themeUtils";
import { api } from "../services/api";

interface AppListTypes {
  boardsView: boolean;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  onEdit?: (app: Application) => void;
  onDelete?: (id: number) => void;
  onStatusUpdate?: (id: number, status: ApplicationStatus) => void;
}

const formatStatusSentenceCase = (status: string) => {
  const formatted = status.replace(/_/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
};

function AppList({
  boardsView,
  applications,
  setApplications,
  onEdit,
  onDelete, onStatusUpdate,
}: AppListTypes) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const toggleFavorite = (id: number, app: Application) => {
    console.log("toggle")
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, favorite: !app.favorite } : app,
      ),
    );

    setSelectedApp((prev) =>
      prev?.id === id ? { ...prev, favorite: !prev.favorite } : prev,
    );

    api.updateApplication(id, { ...app, favorite: !app.favorite });
  };

  const handleStatusUpdate = (id: number, status: ApplicationStatus) => {
    if (onStatusUpdate) onStatusUpdate(id, status);
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status });
    }
  };

  return (
    <div className="bg-surface text-text-main border-border overflow-x-auto rounded-2xl border shadow-sm transition-colors w-full">
      <table className="w-full min-w-4xl table-fixed">
        <thead className="tracking-wide text-gray-400 uppercase">
          <tr className="border-b-[.5px] border-[#b4b4b41a] text-sm">
            <th className="py-4 pl-4 pr-2 text-left">Company</th>
            <th className="py-4 px-2 text-left">Role</th>
            <th className="py-4 px-2 text-left">Date Applied</th>
            <th className="py-4 px-2 text-left">Status</th>
            <th className="py-4 px-2 text-left">Location</th>
            {boardsView && (
              <>
                <th className="py-4 px-2 text-left">Type</th>
                <th className="py-4 px-2 text-left">Salary</th>
                <th className="py-4 px-2 text-left">NOTES</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              className="group border-border cursor-pointer border-b transition-colors hover:bg-gray-50 dark:hover:bg-[#27272A]"
              onClick={() => {
                setSelectedApp(app);
                setIsCardModalOpen(true);
              }}
            >
              <td className="py-3 pl-4 pr-2 font-medium">
                <div className="flex items-center gap-3">
                  <Star
                    size={15}
                    strokeWidth="2"
                    className={`text-primary shrink-0 cursor-pointer ${app.favorite ? "fill-primary opacity-50" : "group-hover:text-primary opacity-0 group-hover:opacity-50"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(app.id, app);
                    }}
                  />
                  <span className="text-text-main">{app.company_name}</span>
                </div>
              </td>
              <td className="p-2 text-text-muted">{app.role}</td>
              <td className="p-2 text-text-muted">{formatDate(app.applied_at, "short")}</td>
              <td className="p-2">
                <span
                  className={`inline-block rounded-3xl px-3 py-1 text-xs font-medium ${getStatusStyles(app.status)}`}
                >
                  {formatStatusSentenceCase(app.status)}
                </span>
              </td>
              <td className="p-2 text-text-muted">
                {app.location}
                {app.extras?.jobNature && <span className="ml-1 text-xs">({app.extras.jobNature})</span>}
              </td>
              {boardsView && (
                <>
                  <td className="p-2 text-text-muted">{app.extras?.workType}</td>
                  <td className="p-2 text-text-muted">
                    {app.salary_min != null && app.salary_max != null
                      ? `${formatSalary(app.salary_min)} - ${formatSalary(app.salary_max)}`
                      : "None"}
                  </td>
                  <td className="p-2 text-text-muted">{app.notes}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedApp && (
        <AppCard
          app={selectedApp}
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          onEdit={() => {
            setIsCardModalOpen(false);
            if (onEdit) onEdit(selectedApp);
          }}
          onDelete={() => {
            if (onDelete && selectedApp) {
              onDelete(selectedApp.id);
              setIsCardModalOpen(false);
            }
          }}
          toggleFavorite={toggleFavorite}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default AppList;
