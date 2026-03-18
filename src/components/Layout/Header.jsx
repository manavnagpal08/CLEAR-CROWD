import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Map as MapIcon, LayoutDashboard, Bell, LogOut, Settings, User, 
  AlertTriangle, Info, CheckCircle2, Zap, Globe, Cpu, Radio, Network, 
  Command, ChevronDown, Activity, Navigation, Smartphone, Satellite
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Badge } from '../ui';
import { toast } from 'sonner';

export const Header = () => {
  const { 
    activeTab, setActiveTab, logout, user, userPoints, getUserBadge, 
    notifications, unreadNotifications, markNotificationsRead, updateUserLocation
  } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showCitySwitcher, setShowCitySwitcher] = useState(false);
  const [showNeuralHub, setShowNeuralHub] = useState(false);
  const badge = getUserBadge();

  const cities = [
    { name: 'Bengaluru', id: 'blr', lat: 12.9716, lng: 77.5946, status: 'Stable' },
    { name: 'Delhi NCR', id: 'del', lat: 28.6139, lng: 77.2090, status: 'High Load' },
    { name: 'Pune', id: 'pun', lat: 18.5204, lng: 73.8567, status: 'Optimal' },
    { name: 'Hyderabad', id: 'hyd', lat: 17.3850, lng: 78.4867, status: 'Busy' },
    { name: 'Kolkata', id: 'kol', lat: 22.5726, lng: 88.3639, status: 'Moderate' },
    { name: 'Chennai', id: 'chn', lat: 13.0827, lng: 80.2707, status: 'Stable' }
  ];

  // Watch for new unread notifications and show toast
  useEffect(() => {
    if (unreadNotifications > 0 && notifications?.length > 0) {
      const latest = notifications[0];
      if (!latest.read) {
        if (latest.type === 'critical') toast.error(latest.title, { description: latest.message });
        else if (latest.type === 'warning') toast.warning(latest.title, { description: latest.message });
        else toast.info(latest.title, { description: latest.message });
      }
    }
  }, [unreadNotifications, notifications]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-12 py-6 pointer-events-none">
      <div className="max-w-[1920px] mx-auto flex justify-between items-center pointer-events-none">
        
        {/* Branding - Left Wing */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="flex items-center gap-3 md:gap-6 pointer-events-auto group cursor-pointer p-1.5 md:p-2 pr-4 md:pr-6 glass-premium rounded-2xl md:rounded-[2.5rem] border-primary/20 hover:bg-[#0A0F19]/80 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,194,255,0.2)]"
          onClick={() => setActiveTab('map')}
        >
          <div className="w-10 h-10 md:w-16 md:h-16 bg-primary rounded-xl md:rounded-[1.8rem] flex items-center justify-center shadow-[0_0_40px_rgba(0,194,255,0.4)] group-hover:scale-105 transition-all duration-500 relative overflow-hidden shrink-0">
            <div className="absolute inset-x-0 h-1.5 md:h-2 bg-white/40 blur-lg animate-scanLineMove opacity-30" />
            <Shield className="text-[#020408] fill-[#020408] relative z-10 w-5 h-5 md:w-8 md:h-8" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase italic font-orbitron leading-none truncate">
               CLEAR<span className="text-primary not-italic">CROWD</span>
            </h1>
            <div className="hidden sm:flex items-center gap-2 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(0,255,156,0.8)]" />
               <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.5em]">AI Assistant Live</p>
            </div>
          </div>
        </motion.div>

        {/* Global Navigation - Center Cockpit */}
        <motion.nav 
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, delay: 0.2 }}
          className="hidden lg:flex items-center glass-premium rounded-[3rem] p-2 gap-2 pointer-events-auto border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon size={18} />} label="Satellite" />
          
          <div className="relative group">
            <button 
              onClick={() => setShowCitySwitcher(!showCitySwitcher)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all duration-300 font-black uppercase text-[10px] tracking-widest border ${showCitySwitcher ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_20px_rgba(0,194,255,0.2)]' : 'bg-transparent border-white/5 text-white/40 hover:bg-white/5 hover:text-white'}`}
            >
              <Globe size={14} className={showCitySwitcher ? 'animate-spin-slow' : ''} />
              Switch City
              <ChevronDown size={12} className={`transition-transform duration-500 ${showCitySwitcher ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showCitySwitcher && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-14 left-0 w-64 glass-premium rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-3 z-[200] overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
                  <div className="flex flex-col gap-1">
                    {cities.map(city => (
                      <button 
                        key={city.id}
                        onClick={() => {
                          useStore.setState({ userLocation: { lat: city.lat, lng: city.lng } });
                          toast.info(`Switching Command to ${city.name} Sector`);
                          setShowCitySwitcher(false);
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/10 border border-transparent hover:border-white/5 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${city.status === 'Stable' ? 'bg-secondary' : city.status === 'High Load' ? 'bg-red-500' : 'bg-primary'} animate-pulse`} />
                          <span className="text-[11px] font-black text-white/80 uppercase tracking-tighter group-hover:text-white">{city.name}</span>
                        </div>
                        <span className="text-[8px] font-black text-white/20 uppercase group-hover:text-primary transition-colors">{city.status}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user?.role === 'admin' && (
            <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<LayoutDashboard size={18} />} label="Tactical" />
          )}
          <NavButton active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')} icon={<Zap size={18} />} label="Architecture" />
          
          <div className="relative">
             <button 
               onClick={() => setShowNeuralHub(!showNeuralHub)}
               className={`flex items-center gap-2 h-10 px-6 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${showNeuralHub ? 'bg-secondary text-slate-950 shadow-[0_0_30px_rgba(0,255,156,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
             >
                <Command size={14} className={showNeuralHub ? 'animate-pulse' : ''} />
                Control Hub
             </button>
             
             <AnimatePresence>
                {showNeuralHub && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    className="absolute top-14 left-0 w-80 glass-premium rounded-[2.5rem] border border-secondary/30 shadow-[0_40px_80px_rgba(0,0,0,0.8)] p-6 z-[200]"
                  >
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                           <Activity size={24} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">AI Decision Engine</h4>
                           <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">Active System State: NOMINAL</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                           <span className="text-[8px] font-black text-white/30 uppercase block mb-1">Grid Health</span>
                           <span className="text-sm font-black text-secondary">99.8%</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                           <span className="text-[8px] font-black text-white/30 uppercase block mb-1">Sat Nodes</span>
                           <span className="text-sm font-black text-primary">1,240</span>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        <button className="w-full p-3 rounded-2xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-all flex items-center justify-between group">
                           <div className="flex items-center gap-3 text-secondary text-[10px] font-black uppercase">
                              <Radio size={14} className="animate-pulse" />
                              Global SOS Alert
                           </div>
                           <ChevronDown size={12} className="-rotate-90 text-white/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </button>
                        <button className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group">
                           <div className="flex items-center gap-3 text-white/50 text-[10px] font-black uppercase group-hover:text-white">
                              <Satellite size={14} />
                              Sensor Diagnostics
                           </div>
                           <ChevronDown size={12} className="-rotate-90 text-white/20 group-hover:translate-x-1 transition-all" />
                        </button>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
          
          <div className="h-10 w-px bg-white/10 mx-2" />
          
          <div className="flex gap-6 px-6 py-2">
             <div className="flex flex-col items-start group cursor-help" title="Overall City Safety Index">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Safety</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_#00FF9C]" />
                   <span className="text-sm font-black text-secondary italic">98.2%</span>
                </div>
             </div>
             
             <div className="flex flex-col items-start group cursor-help" title="IoT Infrastructure Health">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Network</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00C2FF]" />
                   <span className="text-sm font-black text-primary italic">STABLE</span>
                </div>
             </div>
          </div>
        </motion.nav>

        {/* User Stats - Right Wing */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="flex items-center gap-3 md:gap-6 pointer-events-auto glass-premium p-1.5 md:p-2 pl-4 md:pl-8 rounded-2xl md:rounded-[3rem] border-white/5 shadow-2xl"
        >
          <div className="hidden sm:flex items-center gap-4 md:gap-6 border-r border-white/10 pr-4 md:pr-6 mr-1 md:mr-2">
             <div className="flex flex-col items-end">
                <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.1em] md:tracking-[0.2em]">Community Points</span>
                <span className="text-base md:text-xl font-black text-white tabular-nums flex items-center gap-2 font-orbitron italic">
                   {userPoints}
                   <motion.span 
                     animate={{ scale: [1, 1.3, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} 
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="text-secondary text-xs md:text-sm"
                   >
                     ⚡
                   </motion.span>
                </span>
             </div>
          </div>

          <div 
            className="hidden xl:flex flex-col items-end cursor-pointer group/user relative"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          >
             <div className="relative">
                <Bell size={20} className="text-white/40 group-hover/user:text-white transition-colors" />
                {unreadNotifications > 0 && (
                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#04060A]"></span>
                   </span>
                )}
             </div>

             {/* Notifications Dropdown */}
             <AnimatePresence>
                {showNotifDropdown && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute top-12 right-0 w-80 glass-panel rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100]"
                   >
                     <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Intel Alerts</h4>
                        {unreadNotifications > 0 && (
                           <button onClick={(e) => { e.stopPropagation(); markNotificationsRead(); }} className="text-[9px] text-primary hover:text-white uppercase font-bold">Mark Read</button>
                        )}
                     </div>
                     <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                        {notifications?.length === 0 ? (
                           <p className="text-xs text-center text-white/30 py-4 font-medium italic">No new signals detected.</p>
                        ) : (
                           notifications?.slice(0, 10).map(n => (
                              <div key={n.id} className={`p-3 rounded-2xl flex gap-3 transition-colors ${n.read ? 'opacity-50 hover:opacity-100 bg-transparent' : 'bg-white/5 border border-white/5'}`}>
                                 <div className="shrink-0 mt-0.5">
                                    {n.type === 'critical' ? <AlertTriangle size={14} className="text-red-500" /> :
                                     n.type === 'warning' ? <AlertTriangle size={14} className="text-yellow-500" /> :
                                     <Info size={14} className="text-primary" />}
                                 </div>
                                 <div>
                                    <p className={`text-xs font-bold leading-tight ${n.read ? 'text-white/60' : 'text-white'}`}>{n.title}</p>
                                    <p className="text-[10px] text-white/40 mt-1 font-medium">{n.message}</p>
                                    <p className="text-[8px] text-white/20 mt-2 tracking-widest uppercase">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          <div 
            className="hidden xl:flex flex-col items-end cursor-pointer group/user"
            onClick={() => setActiveTab('profile')}
          >
            <span className="text-sm font-black text-white italic tracking-tight group-hover/user:text-primary transition-colors font-futuristic">{user?.name || 'Commander'}</span>
            <div className="flex items-center gap-2">
               <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${badge.color}`}>{badge.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             <div 
               className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.2rem] glass-panel p-0.5 border-primary/30 bg-primary/10 hover:border-primary/60 transition-all cursor-pointer group cyber-glow-blue"
               onClick={() => setActiveTab('profile')}
             >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Commander'}&backgroundColor=transparent&flip=true`} 
                  alt="User" 
                  className="rounded-[0.8rem] md:rounded-[1rem] group-hover:scale-110 transition-transform duration-500" 
                />
             </div>
             
             <div className="h-6 md:h-8 w-px bg-white/10 mx-0.5 md:mx-1 hidden sm:block" />
             
             <button onClick={logout} className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.2rem] glass-panel border-red-500/20 items-center justify-center hover:bg-red-500/10 transition-all group flex shrink-0">
                <LogOut className="text-red-500/40 group-hover:text-red-500 group-hover:rotate-12 transition-all w-4 h-4 md:w-5 md:h-5" />
             </button>
          </div>
          
          <button 
            className="lg:hidden w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.2rem] glass-panel flex items-center justify-center border-white/10 shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
             <div className="space-y-1 w-5 md:w-6">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-2/3'}`} />
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
             </div>
          </button>
        </motion.div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[4000] bg-[#0A0F19]/90 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className="lg:hidden fixed right-6 top-24 left-6 z-[4001] glass-premium rounded-[2.5rem] p-8 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] space-y-4 pointer-events-auto overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10 rounded-full" />
              
              <div className="flex flex-col gap-3">
                {[
                  { id: 'map', label: 'Tactical Map', icon: <MapIcon size={20} /> },
                  ...(user?.role === 'admin' ? [{ id: 'admin', label: 'City Intel', icon: <LayoutDashboard size={20} /> }] : []),
                  { id: 'workflow', label: 'System Logic', icon: <Zap size={20} /> },
                  { id: 'alerts', label: 'Active Alerts', icon: <Bell size={20} /> },
                  { id: 'profile', label: 'User Profile', icon: <User size={20} /> }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all group relative overflow-hidden ${
                      activeTab === item.id 
                        ? 'bg-primary text-[#04060A] shadow-[0_0_30px_rgba(0,194,255,0.4)]' 
                        : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="group-hover:scale-110 transition-transform relative z-10 shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest italic font-orbitron relative z-10">{item.label}</span>
                    
                    {activeTab === item.id && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] border border-red-500/20"
                >
                  <LogOut size={16} /> Terminate
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-5 px-10 py-4 rounded-[2rem] transition-all duration-700 group relative overflow-hidden border ${
      active 
        ? 'bg-primary text-[#020408] shadow-[0_0_50px_rgba(0,194,255,0.4)] border-primary' 
        : 'text-white/20 hover:text-white hover:bg-white/5 border-transparent'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="active-nav-glow"
        className="absolute inset-0 bg-white/10 animate-pulse"
      />
    )}
    <div className={`relative z-10 transition-all duration-700 ${active ? 'scale-125' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
       {icon}
    </div>
    <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] italic font-orbitron">{label}</span>
  </button>
);
