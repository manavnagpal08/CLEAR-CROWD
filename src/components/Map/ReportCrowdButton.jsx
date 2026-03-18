import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, ShieldAlert, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export const ReportCrowdButton = ({ locationId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { submitCrowdReport } = useStore();

  const handleReport = async (level) => {
    const points = await submitCrowdReport(locationId, level);
    toast.success(`Report submitted! +${points} points earned.`, {
      icon: <Zap className="text-primary" />,
      style: { background: '#0F1420', color: '#fff', border: '1px solid rgba(0, 194, 255, 0.2)' }
    });
    setIsExpanded(false);
  };

  const levels = [
    { id: 'low', label: 'Low', color: 'bg-green-500', icon: <Check size={14} /> },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500', icon: <AlertTriangle size={14} /> },
    { id: 'high', label: 'High', color: 'bg-red-500', icon: <ShieldAlert size={14} /> },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 194, 255, 0.2)' }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 h-16 bg-primary/10 border border-primary/30 rounded-3xl flex items-center justify-center gap-4 text-primary font-black uppercase tracking-[0.2em] transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 animate-pulse opacity-30" />
        <Zap size={20} className="group-hover:animate-bounce relative z-10" />
        <span className="relative z-10 text-[10px]">Report Area</span>
        <Badge variant="secondary" className="ml-2 bg-secondary text-slate-950 border-none px-2 py-0.5 text-[9px] relative z-10 tracking-tighter shadow-lg font-black italic">+10 PTS</Badge>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-4 left-0 right-0 glass-panel p-4 rounded-[1.5rem] border-white/10 z-50 flex flex-col gap-2 bg-[#0A0F19]/90 backdrop-blur-xl"
          >
            <p className="text-[10px] font-black uppercase text-white/30 text-center mb-2 tracking-[0.2em]">Select Real-time Level</p>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleReport(lvl.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg ${lvl.color} flex items-center justify-center text-slate-900 shadow-lg`}>
                    {lvl.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white/50 group-hover:text-white">{lvl.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
