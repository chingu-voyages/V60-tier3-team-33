import type { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { PipelineStage } from '../types/metrics';

interface PipelineChartProps {
    data: PipelineStage[];
    total: number;
}

export const PipelineChart: FC<PipelineChartProps> = ({ data, total }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[380px] w-full">
        
            <div className="flex justify-between items-end mb-8 border-b border-gray-50 pb-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Pipeline Funnel
                    </h3>
                </div>
                <div className="text-right flex items-baseline gap-2">
                    <span className="text-sm font-medium text-gray-400">Total Applications</span>
                    <span className="text-3xl font-extrabold text-gray-900">{total}</span>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        
                        <Tooltip 
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        
                        <Bar    
                            dataKey="count" 
                            fill="#6366f1"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};