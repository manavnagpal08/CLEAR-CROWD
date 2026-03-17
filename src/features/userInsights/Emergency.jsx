import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Shield, MapPin, Navigation, Info, AlertOctagon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Emergency = () => {
    const { crowdData, selectedLocation } = useStore();
    const [isActive, setIsActive] = useState(false);

    // Find nearest safe zones (lowest density points in the same city area)
    const safeZones = [...crowdData]
        .filter(l => l.id !== selectedLocation?.id)
        .sort((a, b) => a.density - b.density)
        .slice(0, 3);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
                    <AlertOctagon size={12} /> TACTICAL ESCAPE
                </span>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] font-black text-red-500/50 uppercase tracking-tighter">Emergency Core Active</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isActive ? (
                    <motion.button 
                        key="inactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setIsActive(true)}
                        className="w-full h-32 bg-red-500/5 border-2 border-dashed border-red-500/20 rounded-[3rem] flex flex-col items-center justify-center text-red-500 group hover:bg-red-500/10 hover:border-red-500 transition-all font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-2xl shadow-red-500/5"
                    >
                        <Shield size={32} className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                        Initialize Safe Escape Code
                    </motion.button>
                ) : (
                    <motion.div 
                        key="active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="p-5 rounded-[2rem] bg-secondary/10 border border-secondary/30 flex items-center gap-5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-secondary/5 group-hover:animate-pulse" />
                            <Navigation size={24} className="text-secondary relative z-10" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">RECOMMENDED ESCAPE</p>
                                <p className="text-sm font-black text-white italic tracking-tight">Via Low-Density Sector Delta</p>
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 mb-4">NEAREST SECURE ZONES</p>
                            {safeZones.map((zone, i) => (
                                <motion.div 
                                    key={zone.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20 group-hover:scale-110 transition-transform">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white group-hover:text-secondary transition-colors uppercase italic">{zone.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-1 h-1 rounded-full bg-secondary" />
                                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{Math.round(zone.density)}% Density</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <ArrowRight size={14} className="text-white/10 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => setIsActive(false)}
                            className="w-full py-4 mt-2 text-[10px] font-black text-red-500/40 uppercase tracking-widest hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20 rounded-2xl"
                        >
                            Deactivate Escape Overlay
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
