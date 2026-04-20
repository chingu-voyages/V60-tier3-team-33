import AppList from "../components/AppList";
import StatsOverview from "../components/StatsOverview";
import { formatDate } from "../utilities/formatDate";

function Dashboard() {
  return (
    <div className="bg-background p-5">
      <div className="flex items-center justify-between">
        <div className="py-5">
          <h1 className="mb-3 text-3xl font-bold">Dashboard</h1>
          <div className="text-text-muted">
            {formatDate(new Date(), "long")}
          </div>
        </div>
        <div>
          <button
            type="button"
            className="bg-primary cursor-pointer rounded-xl px-5 py-2 text-sm text-black"
            onClick={() => alert("add app")}
          >
            + Add Application
          </button>
        </div>
      </div>
      <StatsOverview />
      {/* // insights placeholder */}
      <div className="surface my-10 w-full rounded-3xl py-10">INSIGHTS</div>
      <AppList boardsView={false} />
    </div>
  );
}

export default Dashboard;
