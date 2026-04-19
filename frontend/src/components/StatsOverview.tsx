import React from "react";
import { applicationData } from "../mocks/applicationData";
import { statusColors } from "../utilities/statusColors";

function StatsOverview() {
  // create an object with the number of each app status
  const stats = applicationData.reduce(
    (tally, app) => {
      tally.total += 1;
      tally[app.status] = (tally[app.status] || 0) + 1;
      if (app.favorite) tally.favorites += 1;
      return tally;
    },
    {
      total: 0,
      Applied: 0,
      Interviewed: 0,
      Offer: 0,
      Rejected: 0,
      favorites: 0,
    },
  );
  return (
    <div className="flex">
      {Object.entries(stats).map(([key, value]) => (
        <div className={`${statusColors[key].bg} m-1 rounded-lg p-5 flex-1`}>
          <div className="text-2xl">{value}</div>
          <div className={`text-xs ${statusColors[key].text}`}>{key}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsOverview;
