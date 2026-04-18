import type { FC } from 'react';
import type { MetricCardProps } from '../types/metrics';

export const MetricCard: FC<MetricCardProps> = ({ title, percentage, tooltipText }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group relative flex flex-col justify-between">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
            {tooltipText}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>

        <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {title}
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-extrabold text-gray-900">{percentage}%</span>
            </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
  );
};