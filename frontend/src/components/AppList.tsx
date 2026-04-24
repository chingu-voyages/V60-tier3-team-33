import { useEffect, useState } from "react";
import { applicationData } from "../mocks/applicationData";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";
import type { Application } from "../types/dashboard.types";
import { Star } from "lucide-react";
import { getApplications } from "../api/getApplications";

function AppList({ boardsView }: { boardsView: boolean }) {
  const [applications, setApplications] = useState({});
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

useEffect(() => {
  const fetchApplications = async () =>{
    const data = await getApplications();
    setApplications(data);
    console.log(data);
  }
  fetchApplications();
}, []);
  
  return (
    <div className="surface text-text-muted m-5 overflow-x-auto rounded-2xl">
      <table className="w-full min-w-4xl table-fixed">
        <thead className="tracking-wide text-gray-400 uppercase">
          <tr className="border-b-[.5px] border-[#b4b4b41a] tracking-widest">
            <th className="p-5 text-left">Company</th>
            <th className="p-5 text-left">Role</th>
            <th className="p-5 text-left">Date Applied</th>
            <th className="p-5 text-left">Status</th>
            <th className="p-5 text-left">Location</th>
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
        {applicationData.map((app) => (
          <tr
            key={app.id}
            className="hover:bg-background-shadow cursor-pointer border-b-[.5px] border-[#b4b4b41a] duration-100 ease-in"
            onClick={() => setSelectedApp(app)}
          >
            <td className="py-5 text-white">
              <span className="mr-1 inline-block w-5 translate-y-0.5 px-5 opacity-50">
                {app.favorite ? (
                  <Star fill="yellow" size={16} strokeWidth="0" />
                ) : (
                  ""
                )}
              </span>
              {app.company_name}
            </td>
            <td className="p-5 text-gray-400">{app.role}</td>
            <td className="p-5">{formatDate(app.applied_at, "short")}</td>
            <td className="p-5">
              <td
                className={`rounded-3xl bg-[#b4b4b41a] px-3 py-1 ${app.status === "Offer" && "text-green-500"}`}
              >
                {app.status}
              </td>
            </td>
            <td className="p-5">
              {app.location} <p className="pt-1 text-xs">({app.type})</p>
            </td>
            {boardsView && (
              <>
                <td className="p-5">{app.workType}</td>
                <td className="p-5">
                  ${formatSalary(app.salary_min)} - $
                  {formatSalary(app.salary_max)}
                </td>
                <td className="p-5">{app.notes}</td>
              </>
            )}
          </tr>
        ))}
        </tbody>
      </table>
      {selectedApp && (
        <AppCard app={selectedApp} setSelectedApp={setSelectedApp} />
      )}
    </div>
  );
}

export default AppList;
