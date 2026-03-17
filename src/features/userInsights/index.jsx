import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShouldGo } from './ShouldGo';
import { BestTime } from './BestTime';
import { WhyCrowd } from './WhyCrowd';
import { Emergency } from './Emergency';
import { EcoImpact } from './EcoImpact';
import { Brain, Clock, Zap, Shield, Leaf } from 'lucide-react';

export const UserInsightsPanel = () => {
    const [activeTab, setActiveTab] = useState('should-go');

    const tabs = [
        { id: 'should-go', label: 'AI Decision', icon: <Brain size={16} />, component: <ShouldGo /> },
        { id: 'best-time', label: 'Finder', icon: <Clock size={16} />, component: <BestTime /> },
        { id: 'why', label: 'Explain', icon: <Zap size={16} />, component: <WhyCrowd /> },
        { id: 'emergency', label: 'Escape', icon: <Shield size={16} />, component: <Emergency /> },
        { id: 'eco', label: 'Impact', icon: <Leaf size={16} />, component: <EcoImpact /> },
    ];

    return (
        <div className="mt-8 border-t border-white/5 pt-6">
            <div className="flex bg-white/5 rounded-2xl p-1 mb-6 overflow-x-auto no-scrollbar gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'bg-primary text-slate-950 shadow-lg' 
                                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                        }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline-block">{tab.label.split(' ')[0]}</span>
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
