import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShouldGo } from './ShouldGo';
import { BestTime } from './BestTime';
import { WhyCrowd } from './WhyCrowd';
import { Emergency } from './Emergency';
import { EcoImpact } from './EcoImpact';
import { GridFlow } from './GridFlow';
import { Brain, Clock, Zap, Shield, Leaf, Activity } from 'lucide-react';

export const UserInsightsPanel = () => {
    const [activeTab, setActiveTab] = useState('should-go');

    const tabs = [
        { id: 'should-go', label: 'Go?', icon: <Brain size={16} />, component: <ShouldGo /> },
        { id: 'grid-flow', label: 'Flow', icon: <Activity size={16} />, component: <GridFlow /> },
        { id: 'best-time', label: 'Time', icon: <Clock size={16} />, component: <BestTime /> },
        { id: 'why', label: 'Why?', icon: <Zap size={16} />, component: <WhyCrowd /> },
        { id: 'emergency', label: 'Safe', icon: <Shield size={16} />, component: <Emergency /> },
        { id: 'eco', label: 'Eco', icon: <Leaf size={16} />, component: <EcoImpact /> },
    ];

    return (
        <div className="mt-10 pt-10 border-t border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-[1px] bg-primary animate-move-horizontal" />
            
            <div className="flex bg-[#0A0F19]/60 p-1.5 rounded-[2.5rem] mb-10 overflow-x-auto no-scrollbar gap-2 border border-white/5 shadow-inner">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 px-4 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden group ${
                            activeTab === tab.id 
                                ? 'bg-primary text-[#020408] shadow-[0_0_30px_rgba(0,194,255,0.3)]' 
                                : 'text-white/20 hover:text-white/60 hover:bg-white/5'
                        }`}
                    >
                        {activeTab === tab.id && (
                          <motion.div layoutId="active-insight-tab" className="absolute inset-0 bg-white/10" />
                        )}
                        <div className={`relative z-10 transition-transform duration-500 ${activeTab === tab.id ? 'scale-125 rotate-[-10deg]' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                          {tab.icon}
                        </div>
                        <span className="relative z-10 block font-orbitron text-[8px] tracking-tighter truncate w-full text-center">{tab.label.split(' ')[0]}</span>
                    </button>
                ))}
            </div>

            <div className="min-h-[160px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tabs.find(t => t.id === activeTab)?.component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
