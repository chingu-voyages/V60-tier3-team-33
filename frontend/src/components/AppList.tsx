import { useState, useMemo } from "react";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";
import type { Application, ApplicationStatus } from "../types/application";
import { Star, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

type SortKey = keyof Application | 'workType' | 'salary';

function AppList({
  boardsView,
  applications,
  setApplications,
  onEdit,
  onDelete, onStatusUpdate,
}: AppListTypes) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

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

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedApps = useMemo(() => {
    if (!sortConfig) return applications;

    return [...applications].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'workType') {
        aValue = a.extras?.workType || '';
        bValue = b.extras?.workType || '';
      } else if (sortConfig.key === 'salary') {
        aValue = a.salary_min || 0;
        bValue = b.salary_min || 0;
      } else {
        aValue = (a[sortConfig.key as keyof Application] || '').toString().toLowerCase();
        bValue = (b[sortConfig.key as keyof Application] || '').toString().toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [applications, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (!sortConfig || sortConfig.key !== columnKey) return <ArrowUpDown size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="ml-1 text-[#9B6DFF] dark:text-[#F2FF53]" /> : <ArrowDown size={12} className="ml-1 text-[#9B6DFF] dark:text-[#F2FF53]" />;
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] overflow-x-auto rounded-2xl shadow-sm dark:shadow-none transition-colors [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-thumb]:bg-[#3F3F46] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      <table className="w-full table-fixed" style={{ minWidth: boardsView ? '1100px' : '750px' }}>
        <colgroup>
          <col style={{ width: '18%' }} /> {/* Company */}
          <col style={{ width: boardsView ? '15%' : '22%' }} /> {/* Role */}
          <col style={{ width: boardsView ? '12%' : '15%' }} /> {/* Date Applied */}
          <col style={{ width: boardsView ? '13%' : '14%' }} /> {/* Status */}
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
            <th 
              onClick={() => handleSort('company_name')}
              className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center">Company <SortIcon columnKey="company_name" /></div>
            </th>
            <th 
              onClick={() => handleSort('role')}
              className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center">Role <SortIcon columnKey="role" /></div>
            </th>
            <th 
              onClick={() => handleSort('applied_at')}
              className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center">Date Applied <SortIcon columnKey="applied_at" /></div>
            </th>
            <th 
              onClick={() => handleSort('status')}
              className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center">Status <SortIcon columnKey="status" /></div>
            </th>
            <th 
              onClick={() => handleSort('location')}
              className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center">Location <SortIcon columnKey="location" /></div>
            </th>
            {boardsView && (
              <>
                <th 
                  onClick={() => handleSort('workType')}
                  className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">Type <SortIcon columnKey="workType" /></div>
                </th>
                <th 
                  onClick={() => handleSort('salary')}
                  className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A] cursor-pointer group hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">Salary <SortIcon columnKey="salary" /></div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#71717A]">
                  Notes
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-[#2A2A2A]">
          {sortedApps.map((app) => (
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
                  className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(app.status)}`}
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
