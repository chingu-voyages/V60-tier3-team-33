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
      screening: 0,
      interviewing: 0,
      offer_received: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
      favorites: 0,
    },
  );

  const statusLabels = {
    all: "All",
    applied: "Applied",
    screening: "Screening",
    interviewing: "Interviewed",
    offer_received: "Offer",
    accepted: "Accepted",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    favorites: "Favorites",
  };


  return (
    <div className="flex gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <NavLink key={key} to={key !== "favorites" ? `/boards?status=${key}` : "/boards?favorites=true"} className="flex-1">
          <div
            className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:scale-[1.02] dark:border-[#2A2A2A] dark:bg-[#1A1A1A] dark:shadow-none"
          >
            <div className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-[#71717A]">
              {statusLabels[key as keyof typeof statusLabels] || key}
            </div>
            <div className="absolute right-4 top-4 text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-[#71717A]">
              <ChevronRight size={15} />
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
}

export default StatsOverview;
