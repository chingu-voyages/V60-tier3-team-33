import { ConversionDashboard } from "../components/ConversionDashboard";
import StatsOverview from "../components/StatsOverview";
import { formatDate } from "../utilities/formatDate";
import Boards from "./Boards";

function Dashboard() {

  return (
    <div className="bg-gray-800 p-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl">Dashboard</h1>
          <div>{formatDate(new Date(), "long")}</div>
        </div>
        <div>
          <button type="button" className="bg-yellow-300 rounded-xl text-black py-2 px-5 text-sm cursor-pointer" onClick={() => alert("add app")}>+ Add Application</button>
        </div>
      </div>
      <StatsOverview />
      <ConversionDashboard />
      <Boards />
    </div>
  );
}

export default Dashboard;
