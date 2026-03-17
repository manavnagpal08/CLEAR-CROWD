import React from 'react';
import { useStore } from '../../store/useStore';
import { Badge } from '../../components/ui';
import { motion } from 'framer-motion';
import { Zap, CloudRain, Calendar, Clock, MapPin } from 'lucide-react';

export const WhyCrowd = () => {
    const { selectedLocation, weather, events } = useStore();
    
    if (!selectedLocation) return null;

    // Logic to determine tags
    const tags = [];
    const hour = new Date().getHours();
    
    if (hour >= 17 && hour <= 21) {
        tags.push({ label: 'Evening Peak', icon: <Clock size={12} />, color: 'bg-primary/20 text-primary border-primary/30' });
    } else if (hour >= 8 && hour <= 11) {
        tags.push({ label: 'Morning Rush', icon: <Clock size={12} />, color: 'bg-primary/20 text-primary border-primary/30' });
    }
    
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend) {
        tags.push({ label: 'Weekend Load', icon: <Calendar size={12} />, color: 'bg-secondary/20 text-secondary border-secondary/30' });
    }
    
    if (weather?.type === 'rain') {
        tags.push({ label: 'Weather: Rain', icon: <CloudRain size={12} />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' });
    }
    
    const localEvent = events.find(e => e.location === selectedLocation?.name || e.location === 'all');
    if (localEvent) {
        tags.push({ label: `Event: ${localEvent.name}`, icon: <Zap size={12} />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' });
    }

    if (tags.length === 0) {
        tags.push({ label: 'Standard Urban Flow', icon: <MapPin size={12} />, color: 'bg-white/5 text-white/50 border-white/10' });
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest uppercase">Explainable AI Intel</span>
                <Zap size={16} className="text-secondary animate-pulse" />
             </div>

             <div className="flex flex-wrap gap-3 pt-2">
                {tags.map((tag, i) => (
                    <motion.div
                        key={tag.label}
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    >
                        <Badge className={`${tag.color} px-5 py-2.5 rounded-2xl text-[10px] font-black border flex items-center gap-2 group hover:scale-105 transition-transform cursor-default`}>
                            {tag.icon}
                            {tag.label}
                        </Badge>
                    </motion.div>
                ))}
             </div>
             
             <div className="relative overflow-hidden mt-6 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -z-10 rounded-full" />
                <p className="text-xs text-white/40 leading-relaxed font-medium italic relative z-10">
                    "Cognitive engine identifies a mix of <span className="text-white font-black">{tags[0].label}</span> and <span className="text-white font-black">{tags[1]?.label || 'standard conditions'}</span> as the primary drivers of current density signatures in this sector."
                </p>
                <div className="mt-4 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <div className="w-8 h-[1px] bg-white/10" />
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Neural Reasoner v4.2</span>
                </div>
             </div>
        </div>
    );
};
