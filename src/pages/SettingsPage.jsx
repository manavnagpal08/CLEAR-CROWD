import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Eye, Smartphone, LogOut, ChevronRight, Globe, Moon, Clock, Map as MapIcon, X, Check, Save } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Badge, Input } from '../components/ui';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const { user, logout, updateProfile, isLoading } = useStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileForm.name });
      setIsEditingProfile(false);
      toast.success('Profile Synced', {
        description: 'Your tactical identification was updated successfully.'
      });
    } catch (error) {
      toast.error('Sync Failed', {
        description: 'System could not update neural record.'
      });
    }
  };

  const settingsSections = [
    {
      title: 'Profile Settings',
      items: [
        { 
          icon: <User size={20} />, 
          label: 'Personal Information', 
          sub: 'Update your name and contact details', 
          color: 'text-primary',
          onClick: () => setIsEditingProfile(true) 
        },
        { 
          icon: <Shield size={20} />, 
          label: 'Security & Password', 
          sub: 'Manage your login credentials', 
          color: 'text-secondary',
          onClick: () => toast.info('Security Node Active', { description: 'Contact admin for password resets.' })
        },
      ]
    },
    {
      title: 'Crowd Intel',
      items: [
        { 
          icon: <Shield size={20} />, 
          label: 'Risk Thresholds', 
          sub: 'Set your comfort levels for crowds', 
          color: 'text-primary' 
        },
        { 
          icon: <Clock size={20} />, 
          label: 'Power Time Alerts', 
          sub: 'Get notified before peak hours start', 
          color: 'text-secondary' 
        },
        { 
          icon: <MapIcon size={20} />, 
          label: 'Location Tracking', 
          sub: 'Manage high-precision data fetching', 
          color: 'text-amber-500' 
        },
      ]
    },
    {
      title: 'Application',
      items: [
        { icon: <Bell size={20} />, label: 'Notifications', sub: 'Configure alert thresholds', color: 'text-orange-500' },
        { icon: <Eye size={20} />, label: 'Appearance', sub: 'Dark mode and UI customisation', color: 'text-purple-500' },
        { icon: <Globe size={20} />, label: 'Region & Language', sub: 'Set your local data source', color: 'text-green-500' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-12"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] glass-panel p-1 border-primary/30 bg-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Commander'}&backgroundColor=transparent&flip=true`} 
              alt="User" 
              className="rounded-[1.8rem] relative z-10" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary flex items-center justify-center border-4 border-[#04060A] shadow-lg">
            <Smartphone size={14} className="text-[#04060A]" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-black italic tracking-tight uppercase">Settings</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Identification: {user?.role || 'Citizen'}</span>
            <Badge variant={user?.role === 'admin' ? 'danger' : 'success'}>
               {user?.role === 'admin' ? 'System Admin' : 'Active'}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-12">
        {settingsSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 px-2">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div 
                  key={item.label}
                  onClick={item.onClick}
                  className="group relative glass-panel p-6 rounded-[2rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{item.label}</h4>
                      <p className="text-xs text-white/30">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/10 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-8"
        >
          <button 
            onClick={logout}
            className="w-full glass-panel p-6 rounded-[2rem] border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-center gap-4 group"
          >
            <LogOut size={20} className="text-red-500/50 group-hover:rotate-12 transition-all" />
            <span className="font-black uppercase tracking-widest text-sm text-red-500">Terminate Session</span>
          </button>
          
          <p className="text-center text-[10px] text-white/10 mt-12 font-black uppercase tracking-[0.2em]">
            ClearCrowd AI • Version 2.0.4 • Build 8921
          </p>
        </motion.div>
      </div>

      {/* Profile Edit Overlay */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 sm:p-24">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-[#04060A]/80 backdrop-blur-3xl"
               onClick={() => setIsEditingProfile(false)}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="w-full max-w-lg glass-panel p-10 rounded-[3.5rem] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10"
            >
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black italic tracking-tight">EDIT PROFILE</h2>
                  <button onClick={() => setIsEditingProfile(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Public Identification</label>
                    <input 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-primary transition-all"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2 pb-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Secure Email (Read-only)</label>
                    <input 
                      className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-white/30 outline-none"
                      value={profileForm.email}
                      disabled
                    />
                  </div>

                  <Button size="lg" className="w-full h-16 font-black tracking-widest italic group cyber-glow-blue" isLoading={isLoading}>
                    <Save size={18} className="mr-2 group-hover:scale-110 transition-transform" /> 
                    UPDATE RECORD
                  </Button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
