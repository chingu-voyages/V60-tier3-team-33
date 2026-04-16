import { type FC } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import type { PipelineStage } from '../types/metrics';

interface DonutChartProps {
    data: PipelineStage[];
    total: number;
}

const STATUS_COLORS: Record<string, string> = {
    'No Response': '#9CA3AF',
    'Rejected': '#EF4444',
    'Redirected': '#F59E0B',
    'Interviewing': '#3B82F6',
    'Offers': '#10B981'
};

export const DonutChart: FC<DonutChartProps> = ({ data, total }) => {
    const activeData = data
        .filter(item => item.count > 0)
        .map(item => ({
            ...item,
            fill: STATUS_COLORS[item.name] || '#E5E7EB'
        }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[380px] w-full">
        
            <div className="mb-6 border-b border-gray-50 pb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Current Distribution
                </h3>
            </div>

            <div className="flex-1 flex flex-row items-center w-full">
                
                <div className="w-[60%] h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={activeData}
                            cx="50%"
                            cy="50%"
                            innerRadius="70%"
                            outerRadius="100%"
                            paddingAngle={5}
                            cornerRadius={8}
                            dataKey="count"
                            stroke="none"
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#1F2937', fontWeight: 500 }}
                        />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Total</span>
                        <span className="text-4xl font-extrabold text-gray-900 leading-none">{total}</span>
                    </div>
                </div>

                <div className="w-[40%] flex flex-col justify-center pl-2 gap-y-3">
                    {activeData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="w-3 h-3 rounded-full shadow-sm" 
                                    style={{ backgroundColor: entry.fill }}
                                ></span>
                                <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{entry.count}</span>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
};