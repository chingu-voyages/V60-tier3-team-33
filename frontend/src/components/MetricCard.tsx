import type { FC } from 'react';
import type { MetricCardProps } from '../types/metrics';

export const MetricCard: FC<MetricCardProps> = ({ title, value, subtext }) => {
    return (
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#27272A] rounded-2xl p-6 flex flex-col justify-between h-full transition-colors">
            <h3 className="text-gray-500 dark:text-[#A1A1AA] text-sm font-medium tracking-wide mb-3">
                {title}
            </h3>
            <div className="text-gray-900 dark:text-white text-4xl font-bold mb-2">
                {value}
            </div>
            <p className="text-gray-400 dark:text-[#71717A] text-sm">
                {subtext}
            </p>
        </div>
    );
};