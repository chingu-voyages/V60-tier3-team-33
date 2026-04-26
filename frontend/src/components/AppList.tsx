import { useEffect, useState } from "react";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";
import type { Application } from "../types/application";
import { Star } from "lucide-react";
import { api } from "../services/api";

function AppList({ boardsView }: { boardsView: boolean }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.getApplications();
        console.log(data);
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, []);

  const handleDelete = (id: number) => {
    console.log(id);
  };

  return (
    <div className="surface dark:text-text-muted m-5 overflow-x-auto rounded-2xl border border-gray-100 bg-white text-black shadow-sm">
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
              className="dark:hover:bg-background-shadow cursor-pointer border-b-[.5px] border-[#b4b4b41a] duration-100 ease-in hover:bg-gray-100"
              onClick={() => {
                setSelectedApp(app);
                setIsCardModalOpen(true);
              }}
            >
              <td className="py-2 dark:text-white">
                <span className="mr-1 inline-block w-5 translate-y-0.5 px-5 opacity-50">
                  {app.favorite ? (
                    <Star fill="yellow" size={16} strokeWidth="0" />
                  ) : (
                    ""
                  )}
                </span>
                {app.company_name}
              </td>
              <td className="p-2 text-gray-400">{app.role}</td>
              <td className="p-2">{formatDate(app.applied_at, "short")}</td>
              <td className="p-2">
                <td
                  className={`rounded-3xl bg-[#b4b4b41a] px-3 py-1 ${app.status === "offer_received" && "text-green-500"}`}
                >
                  {app.status}
                </td>
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
            // setIsAddModalOpen(true);
          }}
          onDelete={() => selectedApp && handleDelete(selectedApp.id)}
        />
      )}
    </div>
  );
}

export default AppList;
