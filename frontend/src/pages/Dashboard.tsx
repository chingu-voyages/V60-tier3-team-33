import AppList from "../components/AppList";
import StatsOverview from "../components/StatsOverview";
import { formatDate } from "../utilities/formatDate";

function Dashboard() {

  return (
    <div className="bg-background p-5">
      <div className="flex justify-between items-center">
        <div className="py-5">
          <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
          <div className="text-text-muted">{formatDate(new Date(), "long")}</div>
        </div>
        <div>
          <button type="button" className="bg-primary rounded-xl text-black py-2 px-5 text-sm cursor-pointer" onClick={() => alert("add app")}>+ Add Application</button>
        </div>
      </div>
      <StatsOverview />
      {/* // insights placeholder */}
      <div className="py-10 surface my-10 w-full rounded-3xl">INSIGHTS</div>
      <AppList boardsView={false}/>
    </div>
  );
}

export default Dashboard;
