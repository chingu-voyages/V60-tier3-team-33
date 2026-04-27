import { Search } from "lucide-react";
import AppList from "../components/AppList";
import StatsOverview from "../components/StatsOverview";
import { formatDate } from "../utilities/formatDate";
import { ConversionDashboard } from "../components/ConversionDashboard";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Application } from "../types/application";

function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.getApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-5">
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
      <ConversionDashboard />
      <div className="flex items-center justify-between mt-5">
        <div>All Applications</div>
        <div className="flex items-center">
          <div className="absolute pl-3">
            <Search size={18}/>
          </div>
          <input
            className="pl-10 surface mr-3 h-10 rounded-xl text-gray-400"
            placeholder="Search..."
          />
        </div>
      </div>
      <AppList boardsView={false} applications={applications}/>
    </div>
  );
}

export default Dashboard;
