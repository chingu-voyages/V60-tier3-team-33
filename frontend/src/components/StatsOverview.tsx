import { ChevronRight } from "lucide-react";
import type { Application } from "../types/application";
import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { api } from "../services/api";
// import type { AnalyticsResponse } from "../types/metrics";

function StatsOverview({ applications }: { applications: Application[] }) {
  // const [analytics, setAnalytics] = useState<AnalyticsResponse>();
  
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

  // create an object with the number of each app status
  const stats = applications.reduce(
    (tally, app) => {
      tally.all += 1;
      tally[app.status as keyof typeof tally] =
        (tally[app.status as keyof typeof tally] || 0) + 1;
      if (app.favorite) tally.favorites += 1;
      return tally;
    },
    {
      all: 0,
      applied: 0,
      interviewing: 0,
      offer_received: 0,
      accepted: 0,
      rejected: 0,
      favorites: 0,
    },
  );

  const statusLabels = {
    all: "All",
    applied: "Applied",
    interviewing: "Interviewed",
    offer_received: "Offer",
    accepted: "Accepted",
    rejected: "Rejected",
    favorites: "Favorites",
  };


  return (
    <div className="flex gap-1">
      {Object.entries(stats).map(([key, value]) => (
        <NavLink to={`/boards?status=${key}`} className="w-full">
          <div
            key={key}
            className="group m-1 flex flex-1 cursor-pointer justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-100 ease-in hover:scale-105 dark:border-[#27272A] dark:bg-[linear-gradient(180deg,#1b1c1d,#151617)] dark:shadow-none"
          >
            <div>
              <div className="mb-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-[#71717A]">
                {statusLabels[key as keyof typeof statusLabels] || key}
              </div>
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
