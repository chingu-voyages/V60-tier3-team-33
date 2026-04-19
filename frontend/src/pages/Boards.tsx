import { applicationData } from "../mocks/applicationData";

function Boards() {
  // color selector based on applicatoin status
  const appColors = {
    Applied: {
      text: "text-blue-500",
      bg: "bg-blue-500/20",
      dot: "bg-blue-500",
    },
    Interviewed: {
      text: "text-purple-500",
      bg: "bg-purple-500/20",
      dot: "bg-purple-500",
    },
    Offer: {
      text: "text-green-500",
      bg: "bg-green-500/20",
      dot: "bg-green-500",
    },
    Rejected: { text: "text-red-500", bg: "bg-red-500/20", dot: "bg-red-500" },
  };

  return (
    <div className="bg-gray-900 p-5">
      <div className="flex justify-between items-center">
        <div>
          <div>Boards / All</div>
          <div>
            <span className="text-2xl font-bold pr-3">All</span>
            <span className="text-gray-500">{applicationData.length}</span>
          </div>
        </div>
        <div>
          <input className="bg-gray-800 rounded-xl text-white h-10 mr-3"
          placeholder="Search" />
          <button
            type="button"
            className="bg-yellow-300 rounded-xl text-black py-2 px-5 text-sm cursor-pointer"
            onClick={() => alert("add")}
          >
            + Add
          </button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-2xl p-5 text-gray-300 m-5">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th className="text-left">Company</th>
              <th className="text-left">Role</th>
              <th className="text-left">Date Applied</th>
              <th className="text-left">Status</th>
              <th className="text-left">Location</th>
              <th className="text-left">Type</th>
              <th className="text-left">Salary</th>
              <th className="text-left">NOTES</th>
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
              <td className="py-5">{app.dateApplied}</td>
              <td className={`py-5 ${appColors[app.status].text}`}>
                <td className={`${appColors[app.status].bg} rounded-3xl px-2`}>
                  <span
                    className={`rounded-full inline-block h-2 w-2 ${appColors[app.status].dot} mr-1`}
                  ></span>
                  {app.status}
                </td>
              </td>
              <td className="py-5">
                {app.location} <p className="text-xs pt-1">({app.type})</p>
              </td>
              <td className="py-5">{app.workType}</td>
              <td className="py-5">
                {app.minSalary} - {app.maxSalary}
              </td>
              <td className="py-5">{app.notes}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default Boards;
