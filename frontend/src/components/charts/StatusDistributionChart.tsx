import { PieChart, Pie, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

interface StatusDistributionProps {
    appliedCount: number;
    interviewCount: number;
}

interface PieSectorProps {
    cx?: number;
    cy?: number;
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    fill?: string; 
    cornerRadius?: number;
}

export const StatusDistributionChart = ({ appliedCount, interviewCount }: StatusDistributionProps) => {
    const pieData = [
        { name: 'Applied', value: appliedCount - interviewCount, fill: 'var(--pie-1)' },
        { name: 'Interviewed', value: interviewCount, fill: 'var(--pie-3)' }
    ].filter(item => item.value > 0);

    return (
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#27272A] rounded-2xl p-6 h-[300px] flex flex-col transition-colors">
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Status Distribution</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="80%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            shape={(props: PieSectorProps) => (
                                <Sector 
                                    cx={props.cx}
                                    cy={props.cy}
                                    innerRadius={props.innerRadius}
                                    outerRadius={props.outerRadius}
                                    startAngle={props.startAngle}
                                    endAngle={props.endAngle}
                                    fill={props.fill} 
                                    cornerRadius={props.cornerRadius} 
                                />
                            )}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--chart-tooltip-bg)', 
                                borderColor: 'var(--chart-tooltip-border)', 
                                color: 'var(--chart-tooltip-text)', 
                                borderRadius: '8px',
                                border: '1px solid var(--chart-tooltip-border)'
                            }} 
                            itemStyle={{ color: 'var(--chart-tooltip-text)' }} 
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="square"
                            formatter={(value) => <span className="text-gray-500 dark:text-[#A1A1AA] text-sm ml-1 transition-colors">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};