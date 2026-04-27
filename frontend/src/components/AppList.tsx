import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { formatDate } from "../utilities/formatDate";
import { formatSalary } from "../utilities/formatSalary";
import { api } from "../services/api";
import type { Application } from "../types/application";
import AppCard from "./AppCard";
import { getStatusStyles } from '../utilities/themeUtils';

export default function AppList({ boardsView = false }: { boardsView?: boolean }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await api.getApplications(1, 50); 
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (isLoading) {
      return <div className="p-5 text-gray-500 dark:text-gray-400">Loading applications...</div>;
  }

  return (
    <div className="bg-white dark:bg-linear-to-b dark:from-[#1b1c1d] dark:to-[#151617] border border-gray-200 dark:border-[#222324] m-5 overflow-x-auto rounded-2xl shadow-sm transition-colors">
      <table className="w-full min-w-4xl table-fixed">
        <thead className="tracking-wide text-gray-500 dark:text-gray-400 uppercase text-sm">
          <tr className="border-b border-gray-200 dark:border-[#b4b4b41a] tracking-widest">
            <th className="p-5 text-left font-medium">Company</th>
            <th className="p-5 text-left font-medium">Role</th>
            <th className="p-5 text-left font-medium">Date Applied</th>
            <th className="p-5 text-left font-medium">Status</th>
            <th className="p-5 text-left font-medium">Location</th>
            {boardsView && (
              <>
                <th className="text-left p-5 font-medium">Type</th>
                <th className="text-left p-5 font-medium">Salary</th>
                <th className="text-left p-5 font-medium">Notes</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const isFavorite = app.extras?.favorite as boolean | undefined;
            const jobType = app.extras?.jobNature || "Not Specified";
            const workType = app.extras?.workType || "Not Specified";

            return (
              <tr
                key={app.id}
                className="hover:bg-gray-50 dark:hover:bg-[#252525] cursor-pointer border-b border-gray-100 dark:border-[#b4b4b41a] duration-100 ease-in transition-colors"
                onClick={() => setSelectedApp(app)}
              >
                <td className="py-5 text-gray-900 dark:text-white font-medium flex items-center">
                  <span className="inline-block w-8 text-center text-gray-400 hover:text-yellow-400 transition-colors">
                    {isFavorite ? <Star fill="currentColor" size={16} strokeWidth={0} /> : null}
                  </span>
                  {app.company_name}
                </td>
                <td className="p-5 text-gray-600 dark:text-gray-400">{app.role}</td>
                <td className="p-5 text-gray-700 dark:text-gray-300">
                  {formatDate(app.applied_at, "short")}
                </td>
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getStatusStyles(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-5 text-gray-700 dark:text-gray-300">
                  {app.location || "Not specified"}
                  <div className="pt-1 text-xs text-gray-500 dark:text-gray-500">({workType})</div>
                </td>
                {boardsView && (
                  <>
                    <td className="p-5 text-gray-700 dark:text-gray-300">{jobType}</td>
                    <td className="p-5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                       {app.extras?.noSalaryRange || (!app.salary_min && !app.salary_max) 
                          ? 'Not provided' 
                          : `$${formatSalary(app.salary_min)} – $${formatSalary(app.salary_max)}`
                      }
                    </td>
                    <td className="p-5 text-gray-600 dark:text-gray-400 text-sm truncate max-w-50">
                      {app.notes || "-"}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
          {applications.length === 0 && !isLoading && (
              <tr>
                  <td colSpan={boardsView ? 8 : 5} className="p-8 text-center text-gray-500">
                      No applications found.
                  </td>
              </tr>
          )}
        </tbody>
      </table>
      
      {selectedApp && (
        <AppCard 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}
    </div>
  );
}