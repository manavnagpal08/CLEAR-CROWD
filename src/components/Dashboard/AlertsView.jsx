import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, ShieldCheck, Info, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Badge, Button } from '../ui';
import { useStore } from '../../store/useStore';

export const AlertsView = () => {
  const { notifications, markNotificationsRead } = useStore();

  return (
    <div className="h-full w-full bg-[#080B14] p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 leading-none cursor-default">City <span className="text-red-500 italic">Signals</span></h1>
            <p className="text-white/40 font-medium text-lg">Real-time neural grid updates and safety intel</p>
          </div>
          <div className="flex gap-4">
             {notifications.length > 0 && (
                <Badge variant="danger" className="px-4 py-1.5 text-xs animate-pulse">
                  {notifications.filter(n => !n.read).length} Active
                </Badge>
             )}
             <Button variant="secondary" size="sm" onClick={markNotificationsRead}>Mark All Resolved</Button>
          </div>
        </div>

        <div className="space-y-6">
          {notifications.length === 0 ? (
             <div className="h-64 glass-panel flex flex-col items-center justify-center text-center p-12 rounded-[3.5rem] border-white/5 bg-white/[0.01]">
                <ShieldCheck size={48} className="text-primary/20 mb-4" />
                <h3 className="text-xl font-black text-white/40 uppercase tracking-widest">Grid Status: SECURE</h3>
                <p className="text-sm text-white/20 mt-2">No critical crowd anomalies or alerts in your sector.</p>
             </div>
          ) : (
             notifications.map((alert, i) => (
               <motion.div
                 key={alert.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="group"
               >
                 <div className={`glass-panel p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row gap-6 lg:gap-10 items-center relative overflow-hidden ${alert.read ? 'opacity-60' : 'bg-white/[0.02]'}`}>
                   {/* Status Bar */}
                   <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                     alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' :
                     alert.type === 'warning' ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' :
                     'bg-primary'
                   }`} />

                   {/* Icon Container */}
                   <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-3xl lg:rounded-[2.5rem] flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:scale-110 shadow-2xl ${
                      alert.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                   }`}>
                      {alert.type === 'critical' ? <AlertTriangle size={28} /> : 
                       alert.type === 'warning' ? <AlertTriangle size={24} /> : <Bell size={28} />}
                   </div>

                   {/* Content */}
                   <div className="flex-1">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <div className="flex items-center gap-4 mb-1">
                            <h3 className="text-2xl font-black italic tracking-tight">{alert.title}</h3>
                            <Badge variant={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}>
                               {alert.type === 'critical' ? 'CRITICAL' : 'ELEVATED'}
                            </Badge>
                         </div>
                         <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">{new Date(alert.timestamp).toLocaleTimeString()} • Neural Sensor ID: CC-{alert.id.toString().slice(-4)}</span>
                       </div>
                       {!alert.read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00C2FF]" />}
                     </div>

                     <p className="text-white/50 leading-relaxed mb-8 max-w-3xl font-medium text-sm lg:text-base">
                       {alert.message}
                     </p>

                     <div className="flex gap-6">
                       <Button variant="ghost" size="sm" className="px-0 text-primary hover:bg-transparent text-xs font-black uppercase tracking-widest">
                          Tactical Map <ArrowUpRight size={14} className="ml-2" />
                       </Button>
                       <Button variant="ghost" size="sm" className="px-0 text-white/20 hover:bg-transparent group-hover:text-white/40 text-xs font-black uppercase tracking-widest">
                          <MessageSquare size={14} className="mr-2" /> Add Intel Note
                       </Button>
                     </div>
                   </div>

                   <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                      <Button variant="secondary" size="sm" className="rounded-2xl border-white/10">Archive Signal</Button>
                   </div>
                 </div>
               </motion.div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};
