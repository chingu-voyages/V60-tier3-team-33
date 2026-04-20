import { applicationData } from "../mocks/applicationData";
import { formatDate } from "../utilities/formatDate";

function AppList({ boardsView }: { boardsView: boolean }) {
  // check to see if salary is listed and format it
  const formatSalary = (salary: number | null) => {
    if (salary == null) return "Not listed";

    return `${salary / 1000}k`;
  };

  return (
    <div className="bg-[linear-gradient(180deg,#1b1c1d,#151617)] rounded-2xl p-5 text-gray-300 m-5 overflow-x-auto border border-[#222324]">
      <table className="min-w-4xl w-full table-fixed">
        <thead className="text-gray-400 uppercase tracking-wide">
          <tr>
            <th className="text-left">Company</th>
            <th className="text-left">Role</th>
            <th className="text-left">Date Applied</th>
            <th className="text-left">Status</th>
            <th className="text-left">Location</th>
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
          <tr>
            <td className="py-5 text-white">
              <span className="inline-block w-5 text-xs">
                {app.favorite ? "⭐️" : ""}
              </span>
              {app.company}
            </td>
            <td className="py-5">{app.role}</td>
            <td className="py-5">{formatDate(app.dateApplied, "short")}</td>
            <td className="py-5">
              <td className={`rounded-3xl px-3 py-1 bg-[#b4b4b41a] ${app.status === "Offer" && "text-green-500"}`}>
                {app.status}
              </td>
            </td>
            <td className="py-5">
              {app.location} <p className="text-xs pt-1">({app.type})</p>
            </td>
            {boardsView && (
              <>
                <td className="py-5">{app.workType}</td>
                <td className="py-5">
                  {formatSalary(app.minSalary)} - {formatSalary(app.maxSalary)}
                </td>
                <td className="py-5">{app.notes}</td>
              </>
            )}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default AppList;
