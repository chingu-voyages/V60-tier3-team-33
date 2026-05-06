import { PieChart, Pie, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

interface StatusDistributionProps {
    byStatus: {
        applied: number;
        screening: number;
        interviewing: number;
        offer_received: number;
        accepted: number;
        rejected: number;
        withdrawn: number;
    };
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

export const StatusDistributionChart = ({ byStatus }: StatusDistributionProps) => {
    const pieData = [
        { name: 'Applied', value: byStatus.applied, fill: 'var(--pie-1)' },
        { name: 'Interviewed', value: byStatus.screening + byStatus.interviewing, fill: 'var(--pie-2)' },
        { name: 'Offer', value: byStatus.offer_received + byStatus.accepted, fill: 'var(--pie-3)' },
        { name: 'Rejected', value: byStatus.rejected, fill: 'var(--pie-4)' }
    ].filter(item => item.value > 0);

    return (
        <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-2xl p-6 h-75 flex flex-col transition-colors shadow-sm dark:shadow-none">
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Status Distribution</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius="65%"
                            outerRadius="95%"
                            paddingAngle={0}
                            dataKey="value"
                            stroke="currentColor" 
                            strokeWidth={3}
                            className="text-white dark:text-[#18181B]"
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