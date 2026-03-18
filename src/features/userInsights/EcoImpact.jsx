import React from 'react';
import { useStore } from '../../store/useStore';
import { Leaf, Zap, Clock, TrendingDown, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const EcoImpact = () => {
    const { userPoints } = useStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest flex items-center gap-2">
                    <Leaf size={12} /> Urban Eco-Impact
                </span>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(0,255,156,0.8)]" />
                    <span className="text-[8px] font-black text-secondary uppercase tracking-[0.2em]">Live Tracking</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-[2.5rem] bg-secondary/5 border border-secondary/10 flex flex-col items-center text-center group transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                    <span className="text-3xl font-black text-white tabular-nums italic tracking-tighter">12<span className="text-secondary not-italic text-sm ml-1 font-bold font-orbitron">M</span></span>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">Time Saved</span>
                </motion.div>
                
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col items-center text-center group transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <TrendingDown size={24} />
                    </div>
                    <span className="text-3xl font-black text-white tabular-nums italic tracking-tighter">2.4<span className="text-primary not-italic text-sm ml-1 font-bold font-orbitron">KG</span></span>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">CO2 Offset</span>
                </motion.div>
            </div>

            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700">
                    <Award size={60} className="text-secondary" />
                </div>
                
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <div className="relative z-10 flex items-center justify-between mb-8">
                    <div>
                        <h5 className="text-sm font-black text-white mb-1 uppercase italic tracking-tighter flex items-center gap-2">
                            <Zap size={14} className="text-secondary" /> Personal Contribution
                        </h5>
                        <p className="text-[10px] text-white/30 uppercase font-black uppercase tracking-widest">Neural Network Points</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-black text-primary italic font-orbitron leading-none tracking-tighter shadow-primary/20 drop-shadow-md">
                            {userPoints} <span className="text-secondary not-italic text-sm">⚡</span>
                        </span>
                        <span className="text-[8px] font-black text-white/20 uppercase mt-1">Total Earned</span>
                    </div>
                </div>
                
                <div className="relative z-10 space-y-4">
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                        By strategically reporting and routing away from <span className="text-secondary font-black italic uppercase tracking-tighter">Saturation Zones</span>, you've optimized grid efficiency by <span className="text-white font-black font-orbitron">4.2%</span>.
                    </p>
                    
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Status</span>
                            <span className="text-[10px] font-black text-secondary italic tracking-widest">Lv. 4 Guardian</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 2, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-secondary/50 via-secondary to-primary/80 shadow-[0_0_20px_rgba(0,194,255,0.4)] rounded-full animate-shimmer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
