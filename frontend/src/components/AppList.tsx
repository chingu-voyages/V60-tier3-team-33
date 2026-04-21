import { useState } from "react";
import { applicationData } from "../mocks/applicationData";
import { formatDate } from "../utilities/formatDate";
import AppCard from "./AppCard";
import { formatSalary } from "../utilities/formatSalary";

function AppList({ boardsView }: { boardsView: boolean }) {
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <div className="surface text-text-muted m-5 overflow-x-auto rounded-2xl">
      <table className="w-full min-w-4xl table-fixed">
        <thead className="tracking-wide text-gray-400 uppercase">
          <tr className="border-b-[.5px] border-[#b4b4b41a]">
            <th className="text-left p-5">Company</th>
            <th className="text-left p-5">Role</th>
            <th className="text-left p-5">Date Applied</th>
            <th className="text-left p-5">Status</th>
            <th className="text-left p-5">Location</th>
            {boardsView && (
              <>
                <th className="text-left">Type</th>
                <th className="text-left">Salary</th>
                <th className="text-left">NOTES</th>
              </>
            )}
          </tr>
        </thead>
        {applicationData.map((app) => (
          <tr key={app.id} className="cursor-pointer hover:bg-background-shadow duration-100 ease-in border-b-[.5px] border-[#b4b4b41a]" onClick={() => setSelectedApp(app)}>
            <td className="py-5 text-white">
              <span className="inline-block w-5 text-xs px-5">
                {app.favorite ? "⭐️ " : ""}
              </span>
              {app.company}
            </td>
            <td className="p-5 text-gray-400">{app.role}</td>
            <td className="p-5">{formatDate(app.dateApplied, "short")}</td>
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
                  {formatSalary(app.minSalary)} - {formatSalary(app.maxSalary)}
                </td>
                <td className="p-5">{app.notes}</td>
              </>
            )}
          </tr>
        ))}
      </table>
      {selectedApp && <AppCard app={selectedApp} setSelectedApp={setSelectedApp}/>}
    </div>
  );
}

export default AppList;
