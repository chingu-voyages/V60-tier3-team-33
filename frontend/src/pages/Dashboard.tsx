import { useState } from "react";
import AppList from "../components/AppList";
import { ConversionDashboard } from "../components/ConversionDashboard";
import StatsOverview from "../components/StatsOverview";
import { formatDate } from "../utilities/formatDate";

function Dashboard() {
const [boardsView, setBoardsView] = useState(false);

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
      <AppList boardsView={boardsView}/>
    </div>
  );
}

export default Dashboard;
