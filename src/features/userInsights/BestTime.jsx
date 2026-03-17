import React from 'react';
import { useStore } from '../../store/useStore';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { Clock, AlertTriangle } from 'lucide-react';

export const BestTime = () => {
    const { predictions } = useStore();
    
    // Default mock data if predictions not available
    const data = predictions?.chartData || [
        { time: 'T+10', value: 30 },
        { time: 'T+20', value: 45 },
        { time: 'T+30', value: 65 },
        { time: 'T+40', value: 50 },
        { time: 'T+50', value: 35 },
        { time: 'T+60', value: 20 },
    ];

    const bestEntry = data.reduce((prev, curr) => prev.value < curr.value ? prev : curr);
    const worstEntry = data.reduce((prev, curr) => prev.value > curr.value ? prev : curr);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">TEMPORAL ANALYSIS</span>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                   <span className="text-[8px] font-black text-secondary uppercase tracking-[0.2em]">60m Matrix</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[2rem] bg-secondary/5 border border-secondary/20 relative overflow-hidden group hover:bg-secondary/10 transition-all">
                    <div className="absolute top-2 right-4 text-secondary/20 group-hover:scale-125 transition-transform"><Clock size={24} /></div>
                    <span className="text-[8px] font-black uppercase text-secondary tracking-widest block mb-2">OPTIMAL WINDOW</span>
                    <span className="text-xl font-black text-white italic">{bestEntry.time}</span>
                    <p className="text-[9px] text-white/30 mt-1 font-bold">~{Math.round(bestEntry.value)}% Load</p>
                </div>
                <div className="p-5 rounded-[2rem] bg-red-500/5 border border-red-500/20 relative overflow-hidden group hover:bg-red-500/10 transition-all">
                    <div className="absolute top-2 right-4 text-red-500/20 group-hover:scale-125 transition-transform"><AlertTriangle size={24} /></div>
                    <span className="text-[8px] font-black uppercase text-red-500 tracking-widest block mb-2">PEAK SATURATION</span>
                    <span className="text-xl font-black text-white italic">{worstEntry.time}</span>
                    <p className="text-[9px] text-white/30 mt-1 font-bold">~{Math.round(worstEntry.value)}% Load</p>
                </div>
            </div>

            <div className="h-40 w-full mt-2 relative glass-panel rounded-[2rem] border-white/5 bg-white/[0.01] p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0A0F19', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '16px', 
                                fontSize: '10px',
                                padding: '10px'
                            }}
                            itemStyle={{ color: '#00C2FF', fontWeight: 'bold' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#00C2FF" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                
                {/* Visual Label for Best Time on Chart */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Neural Forecast Projection</span>
                </div>
            </div>
        </div>
    );
};
