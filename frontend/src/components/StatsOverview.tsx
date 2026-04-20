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
    <div className="flex">
      {Object.entries(stats).map(([key, value]) => (
        <div className="m-1 rounded-2xl p-5 flex-1 bg-[linear-gradient(180deg,#1b1c1d,#151617)] border-4 border-[#222324] shadow-[0 0 0 1px #383a3e80,0 1px #383a3ecc]">
          <div className="text-4xl font-bold mb-2">{value}</div>
          <div className="text-sm text-gray-500">{key}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsOverview;
