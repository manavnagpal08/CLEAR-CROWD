import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, AlertCircle, TrendingUp, Monitor, Filter, Download, AreaChart as AreaIcon, Zap, Eye, Radio, Thermometer, Bot, ShieldAlert } from 'lucide-react';
import { Button, Badge } from '../ui';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useStore } from '../../store/useStore';

export const AdminDashboard = () => {
  const { crowdData, communityReports } = useStore();
  const [liveLogs, setLiveLogs] = useState([
    { id: 1, type: 'critical', msg: 'Critical congestion detected near MG Road station', time: 'Just now', area: 'Zone A', status: 'active' },
    { id: 2, type: 'warning', msg: 'Incoming crowd from Zomaland Fest event', time: '2m ago', area: 'Central Park', status: 'active' },
    { id: 3, type: 'info', msg: 'Rain forecast may reduce outdoor density', time: '10m ago', area: 'All Zones', status: 'handled' },
  ]);

  const [aiInsights, setAiInsights] = useState([
    { id: 'i1', suggestion: 'Deploy 5 additional personnel to Gate 4', reason: 'High inflow from festival exit', risk: 'Severe' },
    { id: 'i2', suggestion: 'Redirect Tech Park traffic to Sector 7', reason: 'Main arterial road block detected', risk: 'Moderate' },
    { id: 'i3', suggestion: 'Activate cooling stations at City Mall', reason: 'High heat index + crowd density', risk: 'Info' }
  ]);

  const handleAlertStatus = (id) => {
    setLiveLogs(prev => prev.map(log => 
      log.id === id ? { ...log, status: log.status === 'active' ? 'handled' : 'active' } : log
    ));
    toast.success("Alert status updated");
  };

  const trendData = [
    { time: '08:00', value: 3200 },
    { time: '10:00', value: 4500 },
    { time: '12:00', value: 6800 },
    { time: '14:00', value: 5100 },
    { time: '16:00', value: 7200 },
    { time: '18:00', value: 8900 },
    { time: '20:00', value: 4300 },
  ];

  const riskData = [
    { name: 'Critical', value: crowdData.filter(d => d.density > 75).length || 1, color: '#FF4D4D' },
    { name: 'Moderate', value: crowdData.filter(d => d.density > 45 && d.density <= 75).length || 3, color: '#FACC15' },
    { name: 'Optimal', value: crowdData.filter(d => d.density <= 45).length || 2, color: '#00FF9C' },
  ];

  return (
    <div className="h-full w-full bg-[#080B14] p-6 lg:p-12 overflow-y-auto custom-scrollbar">
      {/* Header with Glassmorphism */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
        <div>
          <Badge variant="info" className="mb-4 tabular-nums animate-pulse">
             Authority Command Mode: Active
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
            Force <span className="text-secondary italic">Control</span>
          </h1>
          <p className="text-white/30 font-medium text-lg lg:text-xl mt-2 flex items-center gap-3">
             <Radio size={20} className="text-secondary animate-pulse" /> Live tactical dispatch and grid management
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <select className="bg-white/5 border border-white/10 rounded-2xl px-6 h-14 text-sm font-bold text-white outline-none focus:border-primary/50 transition-all">
             <option value="1h">Last 1 Hour</option>
             <option value="6h">Last 6 Hours</option>
             <option value="24h">Last 24 Hours</option>
          </select>
          <Button className="flex-1 lg:flex-none h-14 rounded-2xl shadow-2xl shadow-primary/20">
             <AlertCircle size={18} className="mr-2" /> Global Alert
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column - Main tactical data */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* AI Insights Panel */}
          <div className="glass-panel p-10 rounded-[3.5rem] border-secondary/20 bg-secondary/5 relative overflow-hidden group">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                  <Bot size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black italic">Tactical AI Suggestions</h3>
                   <p className="text-[10px] text-secondary/60 uppercase font-black tracking-widest mt-1">Real-time crowd control logic</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiInsights.map(insight => (
                  <div key={insight.id} className="p-6 rounded-3xl bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-all">
                     <Badge className="mb-3" variant={insight.risk === 'Severe' ? 'danger' : insight.risk === 'Moderate' ? 'warning' : 'info'}>
                        {insight.risk}
                     </Badge>
                     <p className="text-sm font-bold text-white mb-2">{insight.suggestion}</p>
                     <p className="text-[10px] text-white/40 italic">{insight.reason}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 shadow-[0_0_100px_rgba(0,194,255,0.05)]">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black">Dynamic Flow Metrics</h3>
                   <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Cross-sector load distribution</p>
                </div>
              </div>
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1220', border: 'none', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#00C2FF' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00C2FF" strokeWidth={4} fill="url(#primaryGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* High Risk Targets Table */}
          <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 overflow-hidden">
             <h4 className="text-2xl font-black mb-8 italic">Priority Zones</h4>
             <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                   <thead>
                      <tr className="text-[10px] font-black uppercase text-white/20 tracking-widest px-4">
                         <th className="pb-4 pl-6">Sector</th>
                         <th className="pb-4">Load</th>
                         <th className="pb-4">Trend</th>
                         <th className="pb-4 text-right pr-6">Commander Action</th>
                      </tr>
                   </thead>
                   <tbody>
                      {crowdData.sort((a,b) => b.density - a.density).slice(0, 4).map((loc) => (
                        <tr key={loc.id} className="bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                           <td className="py-6 pl-6 rounded-l-3xl border-y border-l border-white/5 font-bold text-white">{loc.name}</td>
                           <td className="py-6 border-y border-white/5">
                              <Badge variant={loc.density > 75 ? 'danger' : loc.density > 45 ? 'warning' : 'success'}>
                                 {Math.round(loc.density)}%
                              </Badge>
                           </td>
                           <td className="py-6 border-y border-white/5 text-white/40 text-sm font-bold italic">{loc.trend === 'up' ? '↗ Increasing' : '↘ Stabilizing'}</td>
                           <td className="py-6 pr-6 rounded-r-3xl border-y border-r border-white/5 text-right">
                              <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                 Dispatch Team
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Right Column - Intelligence & Monitoring */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Tactical Live Map View (Simplified Simulation) */}
          <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-[#04060A] opacity-80" />
             <div className="absolute inset-0 cyber-grid opacity-20 group-hover:opacity-40 transition-opacity" />
             
             <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-primary/40 flex items-center justify-center animate-spin-slow">
                   <Monitor className="text-primary" size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">Tactical Overlay</h3>
                   <p className="text-[10px] text-white/30 font-black uppercase max-w-[200px]">Node communication established. Rendering live heat signatures.</p>
                </div>
                <Button variant="secondary" className="rounded-2xl h-12 w-full max-w-[200px] text-[10px]">Open Command Map</Button>
             </div>
          </div>

          {/* Unified Alerts Feed */}
          <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 flex flex-col flex-1 min-h-[600px]">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black flex items-center gap-3 italic">
                  <Radio size={20} className="text-red-500" /> Active Intel
                </h3>
                <Badge variant="danger" className="animate-pulse">Live</Badge>
             </div>
             <div className="space-y-6 flex-1 custom-scrollbar overflow-y-auto max-h-[800px] pr-2">
                <AnimatePresence initial={false}>
                   {liveLogs.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-6 rounded-3xl border transition-all relative group ${
                          log.status === 'handled' ? 'bg-white/[0.02] border-white/5 opacity-50' :
                          log.type === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                          log.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                          'bg-primary/5 border-primary/20'
                        }`}
                      >
                         <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                               log.type === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                               log.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                               'bg-primary/10 text-primary border-primary/20'
                            }`}>
                               {log.type === 'critical' ? <ShieldAlert size={16} /> : <AlertCircle size={16} />}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] text-white/20 font-black uppercase tracking-tighter">{log.area}</span>
                                  <span className="text-[8px] text-white/20 font-black uppercase">{log.time}</span>
                               </div>
                               <p className="text-xs font-bold leading-snug group-hover:text-white transition-colors">{log.msg}</p>
                               
                               <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                  <button 
                                    onClick={() => handleAlertStatus(log.id)}
                                    className={`text-[8px] font-black uppercase tracking-widest transition-colors ${
                                      log.status === 'handled' ? 'text-green-500' : 'text-white/30 hover:text-white'
                                    }`}
                                  >
                                     {log.status === 'handled' ? '✓ Handled' : 'Mark as controlled'}
                                  </button>
                                  <Badge variant="secondary" className="text-[7px] py-0.5 opacity-40">Detail</Badge>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon, label, value, trend, color = "primary" }) => {
  const colorMap = {
    primary: "text-primary border-primary/20 bg-primary/5",
    secondary: "text-secondary border-secondary/20 bg-secondary/5",
    yellow: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    red: "text-red-500 border-red-500/20 bg-red-500/5",
  };

  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-10 rounded-[3rem] border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all cursor-default shadow-2xl cyber-shimmer"
    >
      <div className={`absolute -top-10 -right-10 p-20 opacity-5 group-hover:opacity-15 transition-all duration-700 ${colorMap[color].split(' ')[0]}`}>
        {React.cloneElement(icon, { size: 140, strokeWidth: 1 })}
      </div>
      <div className="relative z-10">
        <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em] mb-4">{label}</p>
        <div className="flex items-end gap-3">
          <h4 className="text-6xl font-black tabular-nums leading-none font-futuristic">{value}</h4>
          <Badge variant={trend.startsWith('+') ? 'danger' : 'success'} className="mb-1 text-[8px] py-1 px-3 rounded-lg">
             {trend}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};
