import { ChevronRight } from "lucide-react";
import { applicationData } from "../mocks/applicationData";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { AnalyticsResponse } from "../types/metrics";
import type { Application } from "../types/application";
import { NavLink } from "react-router-dom";

function StatsOverview({ applications }: { applications: Application[] }) {
  // const [analytics, setAnalytics] = useState<AnalyticsResponse>();

  // create an object with the number of each app status
  const stats = applications.reduce(
    (tally, app) => {
      tally.all += 1;
      tally[app.status as keyof typeof tally] = (tally[app.status as keyof typeof tally] || 0) + 1;
      if (app.favorite) tally.favorites += 1;
      return tally;
    },
    {
      all: 0,
      applied: 0,
      interviewed: 0,
      offer_received: 0,
      accepted: 0,
      rejected: 0,
      favorites: 0,
    },
  );

  const statusLabels = {
    all: "All",
    applied: "Applied",
    interviewed: "Interviewed",
    offer_received: "Offer",
    accepted: "Accepted",
    rejected: "Rejected",
    favorites: "Favorites",
  };

  // fetch applications counts
  // useEffect(() => {
  //   const fetchAnalytics = async () => {
  //     try {
  //       const  data  = await api.getAnalytics();
  //       setAnalytics(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchAnalytics();
  // }, []);

  return (
    <div className="flex gap-1">
      {Object.entries(stats).map(([key, value]) => (
        <NavLink to={`/boards/${key}`} className="w-full">
          <div
            key={key}
            className="group dark:shadow-[0 0 0 1px #383a3e80,0 1px #383a3ecc] m-1 flex flex-1 cursor-pointer justify-between rounded-2xl border border-gray-300 bg-white p-5 duration-100 ease-in hover:scale-105 dark:border-4 dark:border-[#222324] dark:bg-[linear-gradient(180deg,#1b1c1d,#151617)]"
          >
            <div>
              <div className="mb-1 text-2xl font-bold">{value}</div>
              <div className="text-sm text-gray-500">{statusLabels[key as keyof typeof statusLabels] || key}</div>
            </div>
            <div className="text-text-muted hidden duration-100 ease-in group-hover:block">
              <ChevronRight />
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
}

export default StatsOverview;
