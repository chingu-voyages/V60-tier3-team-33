import type { FC } from 'react';
import type { MetricCardProps } from '../types/metrics';

export const MetricCard: FC<MetricCardProps> = ({ title, value, subtext }) => {
    return (
        <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-2xl p-6 flex flex-col justify-center transition-colors shadow-sm dark:shadow-none">
            <h3 className="text-gray-500 dark:text-[#A1A1AA] text-sm font-medium mb-3">
                {title}
            </h3>
            <div className="text-gray-900 dark:text-white text-3xl font-bold mb-1 tracking-tight">
                {value}
            </div>
            {subtext && (
                <p className="text-gray-500 dark:text-[#71717A] text-sm">
                    {subtext}
                </p>
            )}
        </div>
    );
};