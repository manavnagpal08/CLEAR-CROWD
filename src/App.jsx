import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Shield, Loader2 } from 'lucide-react';
import { useStore } from './store/useStore';
import { Header } from './components/Layout/Header';
import { LoginPage } from './pages/auth/LoginPage';

import { CrowdMap } from './components/Map/CrowdMap';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { AlertsView } from './components/Dashboard/AlertsView';
import { SettingsPage } from './pages/SettingsPage';
import { WorkflowPage } from './pages/WorkflowPage';

function App() {
  const { isAuthenticated, activeTab, user, initAuth, updateUserLocation } = useStore();
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    console.log("App.jsx: useEffect initializing auth and location");
    initAuth();
    updateUserLocation();
    const timer = setTimeout(() => {
      console.log("App.jsx: Splash screen timer finished");
      setIsStarting(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, [initAuth, updateUserLocation]);

  console.log("App.jsx: Render state", { isStarting, isAuthenticated, activeTab });

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {isStarting ? (
          <motion.div 
            key="startup"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] bg-[#04060A] flex flex-col items-center justify-center p-8"
          >
            <div className="absolute inset-0 cyber-grid opacity-10" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
              transition={{ duration: 2.5, ease: "anticipate" }}
              className="w-48 h-48 mb-16 relative flex items-center justify-center group"
            >
               <div className="absolute inset-0 bg-primary/20 blur-[100px] animate-pulse" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-2 border-primary/30 rounded-[3.5rem] border-dashed"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-6 border border-secondary/20 rounded-[3rem] border-dotted"
               />
               <div className="relative z-10 p-8 glass-panel rounded-[2.5rem] border-primary/40 cyber-glow-blue">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,194,255,0.5)] border border-primary/30">
                     <span className="text-4xl font-black text-primary italic font-orbitron">C</span>
                  </div>
               </div>
            </motion.div>
            
            <div className="space-y-8 text-center max-w-sm">
               <div className="space-y-2">
                 <motion.h2 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className="text-6xl font-black tracking-tighter text-white uppercase italic"
                 >
                   Clear<span className="text-primary not-italic">Crowd</span>
                 </motion.h2>
                 <p className="text-[10px] font-black text-primary/40 uppercase tracking-[1em] ml-2">Neural Intelligence</p>
               </div>

               <div className="w-72 h-1 bg-white/5 mx-auto rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.8, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-primary via-accent to-secondary animate-shimmer"
                  />
                  <div className="absolute inset-0 bg-primary/20 blur-sm animate-pulse" />
               </div>
               
               <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse">Establishing Satellite Uplink</p>
                  <p className="text-[8px] font-medium text-white/10 uppercase tracking-widest">v2.4.0 • Node: Bengaluru-01</p>
               </div>
            </div>
          </motion.div>
        ) : !isAuthenticated ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full"
          >
            <LoginPage />
          </motion.div>
        ) : (
          <motion.div 
            key="app-core"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen"
          >
            {/* Global Visual Effects */}
            <div className="fixed inset-0 pointer-events-none z-[9999]">
               <div className="scanline opacity-20" />
               <div className="absolute inset-0 cyber-grid opacity-10" />
            </div>

            <Header />
            
            <main className="flex-1 relative overflow-hidden pt-20">
                <AnimatePresence mode="wait">
                  {activeTab === 'map' && (
                    <motion.div
                      key="map-view"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", damping: 30, stiffness: 100 }}
                      className="relative h-full w-full"
                    >
                      <CrowdMap />
                    </motion.div>
                  )}
                  {activeTab === 'admin' && user?.role === 'admin' && (
                    <motion.div
                      key="admin-view"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="h-full w-full"
                    >
                      <AdminDashboard />
                    </motion.div>
                  )}
                   {activeTab === 'alerts' && (
                    <motion.div
                      key="alerts-view"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="h-full w-full overflow-y-auto"
                    >
                      <AlertsView />
                    </motion.div>
                  )}
                  {activeTab === 'workflow' && (
                    <motion.div
                      key="workflow-view"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="h-full w-full overflow-y-auto"
                    >
                      <WorkflowPage />
                    </motion.div>
                  )}
                  {activeTab === 'profile' && (
                    <motion.div
                      key="settings-view"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      className="h-full w-full overflow-y-auto custom-scrollbar"
                    >
                      <SettingsPage />
                    </motion.div>
                  )}
                </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster theme="dark" position="bottom-right" richColors />

      {/* Persistent Background Depth & Nebula Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             x: [0, 50, 0],
             y: [0, -30, 0]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[150px] rounded-full" 
         />
         <motion.div 
           animate={{ 
             scale: [1, 1.3, 1],
             x: [0, -50, 0],
             y: [0, 40, 0]
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[120px] rounded-full" 
         />
         <motion.div 
           animate={{ 
             scale: [1, 1.5, 1],
             opacity: [0.3, 0.6, 0.3]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-accent/5 blur-[180px] rounded-full" 
         />
      </div>
    </div>
  );
}

export default App;
