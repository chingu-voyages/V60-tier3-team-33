import { useState } from "react";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";
import type { Application, ApplicationStatus } from "../types/application";
import { Star } from "lucide-react";
import { getStatusStyles } from "../utilities/themeUtils";
import { api } from "../services/api";

/** Friendly status labels for display */
const statusDisplayLabel: Record<string, string> = {
  applied: "Applied",
  screening: "Screening",
  interviewing: "Interviewed",
  offer_received: "Offer Received",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

interface AppListTypes {
  boardsView: boolean;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  onEdit?: (app: Application) => void;
  onDelete?: (id: number) => void;
  onStatusUpdate?: (id: number, status: ApplicationStatus) => void;
}

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
    <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] overflow-x-auto rounded-2xl shadow-sm dark:shadow-none transition-colors [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-thumb]:bg-[#3F3F46] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      <table className="w-full table-fixed" style={{ minWidth: boardsView ? '1100px' : '750px' }}>
        <colgroup>
          <col style={{ width: '18%' }} /> {/* Company */}
          <col style={{ width: boardsView ? '17%' : '22%' }} /> {/* Role */}
          <col style={{ width: boardsView ? '12%' : '15%' }} /> {/* Date Applied */}
          <col style={{ width: boardsView ? '11%' : '14%' }} /> {/* Status */}
          <col style={{ width: boardsView ? '12%' : '18%' }} /> {/* Location */}
          {boardsView && (
            <>
              <col style={{ width: '9%' }} /> {/* Type */}
              <col style={{ width: '10%' }} /> {/* Salary */}
              <col style={{ width: '6%' }} /> {/* Notes */}
            </>
          )}
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100 dark:border-[#2A2A2A]">
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
              Company
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
              Role
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
              Date Applied
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
              Status
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
              Location
            </th>
            {boardsView && (
              <>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
                  Type
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
                  Salary
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
                  Notes
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              className="group border-b border-gray-50 dark:border-[#2A2A2A] last:border-0 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1E1F20]"
              onClick={() => {
                setSelectedApp(app);
                setIsCardModalOpen(true);
              }}
            >
              <td className="px-4 py-5">
                <div className="flex items-center gap-3">
                  <Star
                    size={14}
                    strokeWidth="2"
                    className={`shrink-0 cursor-pointer transition-all ${
                      app.favorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-transparent group-hover:text-gray-400 dark:group-hover:text-[#71717A]"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(app.id, app);
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={app.company_name}>
                    {app.company_name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-5 text-sm text-gray-500 dark:text-zinc-300 truncate" title={app.role}>
                {app.role}
              </td>
              <td className="px-4 py-5 text-sm text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                {formatDate(app.applied_at, "short")}
              </td>
              <td className="px-4 py-5">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(app.status)}`}
                >
                  {statusDisplayLabel[app.status] || app.status}
                </span>
              </td>
              <td className="px-4 py-5">
                <div className="text-sm text-gray-500 dark:text-zinc-400 truncate" title={app.location}>
                  {app.location}
                </div>
                {app.extras?.workType && (
                  <div className="mt-0.5 text-[10px] text-gray-400 dark:text-zinc-600">
                    ({app.extras.workType})
                  </div>
                )}
              </td>
              {boardsView && (
                <>
                  <td className="px-4 py-5 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                    {app.extras?.jobNature || "—"}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                    {app.salary_min != null && app.salary_max != null
                      ? `${formatSalary(app.salary_min)} – ${formatSalary(app.salary_max)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-400 dark:text-zinc-500 truncate">
                    {app.notes || "—"}
                  </td>
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
