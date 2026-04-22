import { ChevronRight } from "lucide-react";
import { applicationData } from "../mocks/applicationData";

function StatsOverview() {
  // create an object with the number of each app status
  const stats = applicationData.reduce(
    (tally, app) => {
      tally.all += 1;
      tally[app.status] = (tally[app.status] || 0) + 1;
      if (app.favorite) tally.favorites += 1;
      return tally;
    },
    {
      all: 0,
      Applied: 0,
      Interviewed: 0,
      Offer: 0,
      Rejected: 0,
      favorites: 0,
    },
  );
  return (
    <div className="flex gap-1">
      {Object.entries(stats).map(([key, value]) => (
        <div className="cursor-pointer group shadow-[0 0 0 1px #383a3e80,0 1px #383a3ecc] m-1 flex flex-1 justify-between rounded-2xl border-4 border-[#222324] bg-[linear-gradient(180deg,#1b1c1d,#151617)] p-5 duration-100 ease-in hover:scale-105">
          <div>
            <div className="mb-2 text-4xl font-bold">{value}</div>
            <div className="text-sm text-gray-500">{key}</div>
          </div>
          <div className="hidden duration-100 ease-in group-hover:block text-text-muted">
            <ChevronRight />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsOverview;
