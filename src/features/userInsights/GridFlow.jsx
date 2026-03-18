import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const GridFlow = () => {
    const { selectedLocation } = useStore();
    
    // Generate realistic sinusoidal data with some noise
    const generateData = () => {
        const data = [];
        const base = selectedLocation?.density || 50;
        const now = new Date();
        
        for (let i = -12; i <= 12; i++) {
            const time = new Date(now.getTime() + i * 3600000); // 1 hour steps
            const hour = time.getHours();
            
            // Artificial peak logic (morning/evening)
            let factor = 1;
            if (hour >= 8 && hour <= 10) factor = 1.4;
            else if (hour >= 17 && hour <= 20) factor = 1.6;
            else if (hour >= 2 && hour <= 5) factor = 0.3;
            
            const value = Math.max(5, Math.min(100, base * factor + (Math.random() * 10 - 5)));
            
            data.push({
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                density: Math.round(value),
                active: i === 0
            });
        }
        return data;
    };

    const data = generateData();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                    <Activity size={12} /> Neural Grid Flow Analysis
                </span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#00FF9C]" />
                        <span className="text-[8px] font-black text-secondary uppercase tracking-widest">Live Signals</span>
                    </div>
                </div>
            </div>

            <div className="h-[220px] w-full bg-[#0A0F19]/40 rounded-[2.5rem] border border-white/5 p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis 
                            dataKey="time" 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={8} 
                            tickLine={false} 
                            axisLine={false}
                            interval={4}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#020408', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '16px',
                                fontSize: '10px',
                                fontFamily: 'Orbitron'
                            }}
                            itemStyle={{ color: '#00C2FF' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="density" 
                            stroke="#00C2FF" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorDensity)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">24h Peak</span>
                        <span className="text-xs font-black text-white italic uppercase font-orbitron">88% Capacity</span>
                    </div>
                </div>
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shrink-0">
                        <Clock size={18} />
                    </div>
                    <div>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">Best Entry</span>
                        <span className="text-xs font-black text-white italic uppercase font-orbitron">9:15 PM Approx.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
