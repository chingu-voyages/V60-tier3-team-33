import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface WeeklyChartProps {
    data: { week: string; total: number; interviewed: number }[];
}

export const WeeklyApplicationsChart = ({ data }: WeeklyChartProps) => {
    return (
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#27272A] rounded-2xl p-6 h-[300px] flex flex-col transition-colors">
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Applications This Month (by week)</h3>
            <div className="flex-1 -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorInterviewed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="week" stroke="var(--chart-axis)" tick={{fill: 'var(--chart-tick)', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                        <YAxis 
                            stroke="var(--chart-axis)" 
                            tick={{fill: 'var(--chart-tick)', fontSize: 12}} 
                            tickLine={false} 
                            axisLine={false} 
                            tickCount={5} 
                            domain={[0, 'dataMax + 2']}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', color: 'var(--chart-tooltip-text)', borderRadius: '8px' }} 
                            itemStyle={{ color: 'var(--chart-tooltip-text)' }} 
                        />
                        <Area type="monotone" dataKey="total" stroke="var(--color-secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                        <Area type="monotone" dataKey="interviewed" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorInterviewed)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};