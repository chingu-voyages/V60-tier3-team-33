import { useState } from "react";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";
import type { Application } from "../types/application";
import { Star } from "lucide-react";
import { getStatusStyles } from "../utilities/themeUtils";
import { api } from "../services/api";

interface AppListTypes {
  boardsView: boolean;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  onEdit?: (app: Application) => void;
  onDelete?: (id: number) => void;
}

function AppList({
  boardsView,
  applications,
  setApplications,
  onEdit,
  onDelete,
}: AppListTypes) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const toggleFavorite = (id: number, app: Application) => {
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

  return (
    <div className="bg-surface text-text-main border-border m-5 overflow-x-auto rounded-2xl border shadow-sm transition-colors">
      <table className="w-full min-w-4xl table-fixed">
        <thead className="tracking-wide text-gray-400 uppercase">
          <tr className="border-b-[.5px] border-[#b4b4b41a] text-sm">
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Date Applied</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Location</th>
            {boardsView && (
              <>
                <th className="text-left">Type</th>
                <th className="text-left">Salary</th>
                <th className="text-left">NOTES</th>
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
              <td className="py-3 font-medium">
                <div className="flex items-center gap-2">
                  <Star
                    size={15}
                    strokeWidth="2"
                    className={`text-primary ml-3 ${app.favorite ? "fill-primary opacity-50" : "group-hover:text-primary opacity-0 group-hover:opacity-50"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(app.id, app);
                    }}
                  />
                  {app.company_name}
                </div>
              </td>
              <td className="p-2 text-gray-400">{app.role}</td>
              <td className="p-2">{formatDate(app.applied_at, "short")}</td>
              <td className="p-2">
                <span
                  className={`inline-block rounded-3xl border px-3 py-1 text-xs font-medium ${getStatusStyles(app.status)}`}
                >
                  {app.status}
                </span>
              </td>
              <td className="p-2">
                {app.location}{" "}
                <p className="pt-1 text-xs">
                  {app.extras?.jobNature && `(${app.extras.jobNature})`}
                </p>
              </td>
              {boardsView && (
                <>
                  <td className="p-2">{app.extras?.workType}</td>
                  <td className="p-2">
                    {app.salary_min != null && app.salary_max != null
                      ? `${formatSalary(app.salary_min)} - ${formatSalary(app.salary_max)}`
                      : "None"}
                  </td>
                  <td className="p-2">{app.notes}</td>
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
        />
      )}
    </div>
  );
}

export default AppList;
