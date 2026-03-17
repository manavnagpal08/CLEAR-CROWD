import React from 'react';
import { useStore } from '../../store/useStore';
import { Badge } from '../../components/ui';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const ShouldGo = () => {
    const { selectedLocation } = useStore();
    
    if (!selectedLocation) return null;

    const density = selectedLocation.density;
    let decision = "Go Now";
    let color = "text-secondary";
    let bgPulse = "bg-secondary/20";
    let reason = "Crowd is stable and low. Ideal conditions for visit.";

    if (density > 75) {
        decision = "Avoid";
        color = "text-red-500";
        bgPulse = "bg-red-500/20";
        reason = "Extremely high density. Safety risk elevated. System recommends waiting.";
    } else if (density > 45) {
        decision = "Wait 15m";
        color = "text-yellow-400";
        bgPulse = "bg-yellow-400/20";
        reason = "Moderate crowd detected. Density is currently fluctuating.";
    }

    // AI Check for trend
    const isIncreasing = selectedLocation.trend === 'up';
    if (isIncreasing) {
        reason += " Warning: Crowd increasing in next 30 mins.";
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">AI DECISION ENGINE</span>
                <Badge variant="info" className="text-[8px]">Decision Signal: {isIncreasing ? 'Diverging' : 'Stable'}</Badge>
            </div>
            
            <div className="relative group overflow-hidden bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-8 text-center">
                <div className={`absolute -inset-4 ${bgPulse} blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity`} />
                
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="relative z-10"
                >
                    <h4 className={`text-5xl font-black italic uppercase tracking-tighter ${color} mb-3 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                        {decision}
                    </h4>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            {isIncreasing ? <TrendingUp size={14} className="text-red-500" /> : <TrendingDown size={14} className="text-secondary" />}
                            <p className="text-[10px] font-black uppercase tracking-wider">
                                {isIncreasing ? 'Load Increasing' : 'Load Decreasing'}
                            </p>
                        </div>
                        <p className="text-xs font-medium text-white/40 max-w-[240px] leading-relaxed italic">
                            "{reason}"
                        </p>
                    </div>
                </motion.div>
            </div>
            
            <button className="w-full h-14 rounded-2xl bg-primary text-slate-950 font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,194,255,0.2)] flex items-center justify-center gap-3 group">
                Establish Neural Path
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                    <Info size={14} />
                </div>
            </button>
        </div>
    );
};
