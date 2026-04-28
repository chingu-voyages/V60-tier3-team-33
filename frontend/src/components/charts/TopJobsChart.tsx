import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface TopJobsChartProps {
    data: { name: string; count: number }[];
}

export const TopJobsChart = ({ data }: TopJobsChartProps) => {
    return (
        <div className="bg-surface text-text-main border border-gray-200 dark:border-[#27272A] rounded-2xl p-6 h-75 flex flex-col transition-colors">
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Top Job Titles Applied</h3>
            <div className="flex-1 -ml-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                        <XAxis 
                            type="number" 
                            domain={[0, 'dataMax']} 
                            allowDecimals={false}
                            stroke="var(--chart-axis)" 
                            tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} width={100} />
                        <Tooltip cursor={{fill: 'var(--chart-cursor)', opacity: 0.4}} contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', color: 'var(--chart-tooltip-text)', borderRadius: '8px' }} itemStyle={{ color: 'var(--chart-tooltip-text)' }} />
                        <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};