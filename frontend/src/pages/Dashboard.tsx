import { ConversionDashboard } from "../components/ConversionDashboard";
import StatsOverview from "../components/StatsOverview";
import Boards from "./Boards";

function Dashboard() {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-800 p-5">
      <div>
        <h1 className="text-2xl">Dashboard</h1>
        <div>{date}</div>
      </div>
      <StatsOverview />
      <ConversionDashboard />
      <Boards />
    </div>
  );
}

export default Dashboard;
