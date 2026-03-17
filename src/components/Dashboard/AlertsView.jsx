import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, ShieldCheck, Info, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Badge, Button } from '../ui';

export const AlertsView = () => {
  const alerts = [
    { id: 1, type: 'critical', title: 'Very Crowded: MG Road', time: '2m ago', desc: 'Area is extremely busy. Try taking another route for a quieter walk.', priority: 'High', status: 'Active' },
    { id: 2, type: 'warning', title: 'Getting Busier: Indiranagar', time: '12m ago', desc: 'More people expected here around 18:30 due to local markets.', priority: 'Medium', status: 'Watching' },
    { id: 3, type: 'info', title: 'App Update', time: '1h ago', desc: 'We have updated our maps to show more accurate details.', priority: 'Low', status: 'Done' },
    { id: 4, type: 'success', title: 'Quiet Route Found', time: '3h ago', desc: 'New quiet path found around Whitefield construction.', priority: 'Medium', status: 'Live' },
  ];

  return (
    <div className="h-full w-full bg-[#080B14] p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 leading-none">City <span className="text-red-500">Alerts</span></h1>
            <p className="text-white/40 font-medium text-lg">Quick updates on busy areas and safety tips</p>
          </div>
          <div className="flex gap-4">
             <Badge variant="danger" className="px-4 py-1.5 text-xs animate-pulse">4 Updates</Badge>
             <Button variant="secondary" size="sm">Clear all</Button>
          </div>
        </div>

        <div className="space-y-6">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="glass-panel p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row gap-6 lg:gap-8 items-start relative overflow-hidden">
                {/* Status Bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 sm:w-1.5 ${
                  alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                  alert.type === 'warning' ? 'bg-yellow-400' :
                  alert.type === 'success' ? 'bg-secondary' : 'bg-primary'
                }`} />

                {/* Icon Container */}
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:scale-105 ${
                   alert.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/40'
                }`}>
                   {alert.type === 'critical' ? <AlertTriangle size={24} /> : <Bell size={24} />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-xl font-bold">{alert.title}</h3>
                         <Badge variant={alert.type === 'critical' ? 'danger' : 'info'}>{alert.priority}</Badge>
                      </div>
                      <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">{alert.time} • Internal System Sensor 0{alert.id}</span>
                    </div>
                    <span className="text-[10px] bg-white/5 px-3 py-1 rounded-lg text-white/40 font-black uppercase">{alert.status}</span>
                  </div>

                  <p className="text-white/50 leading-relaxed mb-6 max-w-3xl font-medium">
                    {alert.desc}
                  </p>

                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="px-0 text-primary hover:bg-transparent">
                       Check details <ArrowUpRight size={14} className="ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 text-white/40 hover:bg-transparent group-hover:text-white">
                       <MessageSquare size={14} className="mr-2" /> Add a note
                    </Button>
                  </div>
                </div>

                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="secondary" size="sm">Dismiss</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
