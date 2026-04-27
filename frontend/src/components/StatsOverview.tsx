import { ChevronRight } from "lucide-react";

interface StatsProps {
  stats: {
    all: number;
    applied: number;
    interviewing: number;
    offers: number;
    rejected: number;
  };
}

export default function StatsOverview({ stats }: StatsProps) {
  const statCards = [
    { label: "All Applications", value: stats.all },
    { label: "Applied", value: stats.applied },
    { label: "Interviewing", value: stats.interviewing },
    { label: "Offers", value: stats.offers },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="cursor-pointer group flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-[#222324] bg-surface text-text-main dark:from-[#1b1c1d] dark:to-[#151617] p-5 duration-100 ease-in hover:scale-[1.02] shadow-sm transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
            </div>
            <div className="opacity-0 -translate-x-2 transition-all duration-200 ease-in group-hover:opacity-100 group-hover:translate-x-0 text-gray-400 dark:text-gray-500">
              <ChevronRight />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}