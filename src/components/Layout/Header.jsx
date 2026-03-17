import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Map as MapIcon, LayoutDashboard, Bell, LogOut, Settings, User, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Badge } from '../ui';
import { toast } from 'sonner';

export const Header = () => {
  const { activeTab, setActiveTab, logout, user, userPoints, getUserBadge, notifications, unreadNotifications, markNotificationsRead } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const badge = getUserBadge();

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
          className="flex items-center gap-5 pointer-events-auto group cursor-pointer p-2 glass-panel rounded-[2rem] border-primary/30 bg-[#0A0F19]/60 hover:bg-[#0A0F19]/80 transition-all shadow-3xl cyber-glow-blue"
          onClick={() => setActiveTab('map')}
        >
          <div className="w-14 h-14 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(0,194,255,0.6)] group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-x-0 h-1.5 bg-white/50 blur-md animate-scanLineMove opacity-40" />
            <Shield className="text-[#04060A] fill-[#04060A] relative z-10" size={28} />
          </div>
          <div className="pr-4">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic glitch-hover font-futuristic">
               Clear<span className="text-primary not-italic">Crowd</span>
            </h1>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(0,255,156,0.8)]" />
               <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.4em]">Tactical Neural Grid</p>
            </div>
          </div>
        </motion.div>

        {/* Global Navigation - Center Cockpit */}
        <motion.nav 
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, delay: 0.2 }}
          className="hidden lg:flex glass-panel rounded-[2.5rem] p-2 gap-2 pointer-events-auto border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] border-t-white/20"
        >
          <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon size={18} />} label="Satellite" />
          {user?.role === 'admin' && (
            <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<LayoutDashboard size={18} />} label="Tactical" />
          )}
          <NavButton active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon={<Bell size={18} />} label="Notifications" />
        </motion.nav>

        {/* User Stats - Right Wing */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="flex items-center gap-6 pointer-events-auto glass-panel p-2 pl-6 rounded-[2.5rem] border-white/5 bg-[#0A0F19]/40 shadow-3xl"
        >
          <div className="flex items-center gap-4 border-r border-white/10 pr-4 mr-2">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Points</span>
                <span className="text-sm font-black text-white tabular-nums flex items-center gap-1 group/pts font-futuristic">
                   {userPoints}
                   <motion.span 
                     animate={{ 
                       rotate: [0, 20, -20, 0],
                       scale: [1, 1.2, 1] 
                     }} 
                     transition={{ repeat: Infinity, duration: 3 }}
                     className="text-xs"
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

          <div className="flex items-center gap-3">
             <div 
               className="w-12 h-12 rounded-[1.2rem] glass-panel p-0.5 border-primary/30 bg-primary/10 hover:border-primary/60 transition-all cursor-pointer group cyber-glow-blue"
               onClick={() => setActiveTab('profile')}
             >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Commander'}&backgroundColor=transparent&flip=true`} 
                  alt="User" 
                  className="rounded-[1rem] group-hover:scale-110 transition-transform duration-500" 
                />
             </div>
             
             <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
             
             <button onClick={logout} className="w-12 h-12 rounded-[1.2rem] glass-panel border-red-500/20 items-center justify-center hover:bg-red-500/10 transition-all group flex">
                <LogOut size={20} className="text-red-500/40 group-hover:text-red-500 group-hover:rotate-12 transition-all" />
             </button>
          </div>
          
          <button 
            className="lg:hidden w-12 h-12 rounded-[1.2rem] glass-panel flex items-center justify-center border-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
             <div className="space-y-1.5 w-6">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-2/3'}`} />
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
             </div>
          </button>
        </motion.div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="lg:hidden mt-8 glass-panel rounded-[3rem] p-8 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] space-y-4 max-w-sm mx-auto pointer-events-auto"
          >
            {[
              { id: 'map', label: 'Tactical Map', icon: <MapIcon /> },
              ...(user?.role === 'admin' ? [{ id: 'admin', label: 'City Intel', icon: <LayoutDashboard /> }] : []),
              { id: 'alerts', label: 'Active Alerts', icon: <Bell /> }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-6 p-5 rounded-[2rem] transition-all group ${
                  activeTab === item.id ? 'bg-primary text-[#04060A]' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="font-black text-lg uppercase tracking-tight italic">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-8 py-3.5 rounded-[1.8rem] transition-all duration-700 group relative overflow-hidden ${
      active 
        ? 'bg-primary text-[#04060A] shadow-[0_0_40px_rgba(0,194,255,0.4)]' 
        : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="active-nav-glow"
        className="absolute inset-0 bg-white/10 animate-pulse-gentle"
      />
    )}
    <div className={`relative z-10 transition-all duration-500 scale-110 ${active ? 'rotate-[-5deg]' : 'group-hover:rotate-12'}`}>
       {icon}
    </div>
    <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] italic pr-2">{label}</span>
  </button>
);
