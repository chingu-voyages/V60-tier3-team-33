import AppList from "../components/AppList";
import StatsOverview from "../components/StatsOverview";
import { formatDate } from "../utilities/formatDate";

function Dashboard() {

  return (
    <div className="bg-[#0F0F0F] p-5">
      <div className="flex justify-between items-center">
        <div className="py-5">
          <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
          <div className="text-gray-500">{formatDate(new Date(), "long")}</div>
        </div>
        <div>
          <button type="button" className="bg-yellow-300 rounded-xl text-black py-2 px-5 text-sm cursor-pointer" onClick={() => alert("add app")}>+ Add Application</button>
        </div>
      </div>
      <StatsOverview />
      <div className="py-10 bg-gray-800 my-10 w-full">INSIGHTS</div>
      <AppList boardsView={false}/>
    </div>
  );
}

export default Dashboard;
