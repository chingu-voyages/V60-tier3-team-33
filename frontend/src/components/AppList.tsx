import { applicationData } from "../mocks/applicationData";
import { formatDate } from "../utilities/formatDate";
import { statusColors } from "../utilities/statusColors";

function AppList({ boardsView }: { boardsView: boolean }) {
  // check to see if salary is listed and format it
  const formatSalary = (salary: number | null) => {
    if (salary == null) return "Not listed";

    return `${salary / 1000}k`;
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-5 text-gray-300 m-5 overflow-x-auto">
      <table className="min-w-6xl w-full table-fixed">
        <thead>
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
            <td className={`py-5 ${statusColors[app.status].text}`}>
              <td className={`${statusColors[app.status].bg} rounded-3xl px-2`}>
                <span
                  className={`rounded-full inline-block h-2 w-2 ${statusColors[app.status].dot} mr-1`}
                ></span>
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
