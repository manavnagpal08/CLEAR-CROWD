import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui';
import { CommunityFeed } from '../Community/CommunityFeed';
import { CrowdAssistant } from '../Community/CrowdAssistant';
import { MessageSquare, MousePointer2, Clock, Map as MapIcon, Navigation, HelpCircle, Bot, Zap } from 'lucide-react';
import { ReportCrowdButton } from './ReportCrowdButton';
import { UserInsightsPanel } from '../../features/userInsights';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/**
 * Controller to handle programmatic map movements
 */
function MapController() {
  const map = useMap();
  const { userLocation } = useStore();
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    }
  }, [userLocation, map]);

  return null;
}

export const CrowdMap = () => {
  const { 
    crowdData, communityReports, fetchCrowdData, setSelectedLocation, 
    selectedLocation, viewMode, setViewMode, historySlider, setHistorySlider, 
    userLocation, updateUserLocation, fetchCommunityReports, predictions, anomalies
  } = useStore();
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [mapLayer, setMapLayer] = useState('standard'); // 'standard' | 'heatmap' | 'security'

  useEffect(() => {
    updateUserLocation();
    fetchCommunityReports();
    const interval = setInterval(() => {
        const { lat, lng } = useStore.getState().userLocation;
        fetchCrowdData(lat, lng);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative w-full h-full bg-[#04060A] overflow-hidden flex items-center justify-center p-4">
      {/* Real City Map Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative w-full h-[90vh] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] glass-panel"
      >
        <MapContainer 
          center={[userLocation.lat, userLocation.lng]} 
          zoom={14} 
          style={{ width: '100%', height: '100%', background: '#04060A' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          {/* Prediction Mode Selector (Moved for better UX) */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[1000] flex gap-3 p-1.5 glass-panel rounded-full border border-white/5 bg-[#0A0F19]/60">
             {['live', '30m', '60m'].map(mode => (
               <button 
                 key={mode}
                 onClick={() => setViewMode(mode)}
                 className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                   viewMode === mode 
                    ? 'bg-primary text-slate-950' 
                    : 'text-white/30 hover:text-white'
                 }`}
               >
                 {mode === 'live' ? 'Dynamic' : mode}
               </button>
             ))}
          </div>

          <MapController />

          {/* User Marker with Pulse */}
          <CircleMarker 
            center={[userLocation.lat, userLocation.lng]} 
            radius={8} 
            pathOptions={{ color: '#00C2FF', fillColor: '#00C2FF', fillOpacity: 0.8, weight: 2 }}
          >
             <Popup>Commander's Signal</Popup>
          </CircleMarker>
          <CircleMarker 
            center={[userLocation.lat, userLocation.lng]} 
            radius={20} 
            pathOptions={{ color: '#00C2FF', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
          />

          {/* Crowd Heatmap Nodes */}
          {/* Crowd Heatmap Nodes */}
          {crowdData.filter(loc => {
            if (mapLayer === 'security') return loc.density > 60 || anomalies.some(a => a.locationId === loc.id);
            if (mapLayer === 'heatmap') return loc.density > 20;
            return true;
          }).map((loc) => {
             const isAnomaly = anomalies.some(a => a.locationId === loc.id);
             return (
               <HeatmapNode 
                  key={loc.id} 
                  location={loc} 
                  isSelected={selectedLocation?.id === loc.id}
                  isAnomaly={isAnomaly}
                  mapLayer={mapLayer}
                  onClick={() => setSelectedLocation(loc)}
                  onHover={() => setHoveredLocation(loc)}
                  onLeave={() => setHoveredLocation(null)}
               />
             );
          })}

          {communityReports.map((report, i) => (
             <CircleMarker 
                key={`report-${i}`}
                center={[report.lat, report.lng]} 
                radius={report.type === 'emergency' ? 30 : 14} 
                pathOptions={{ 
                  color: report.type === 'emergency' ? '#EF4444' : '#00FF9C', 
                  fillColor: report.type === 'emergency' ? '#EF4444' : '#00FF9C',
                  fillOpacity: report.type === 'emergency' ? 0.4 : 0.3, 
                  weight: report.type === 'emergency' ? 4 : 2, 
                  dashArray: report.type === 'emergency' ? '10, 10' : '4, 4',
                  className: report.type === 'emergency' ? 'animate-pulse' : ''
                }}
             >
                <Popup>
                   <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${report.type === 'emergency' ? 'bg-red-500' : 'bg-secondary'}`} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${report.type === 'emergency' ? 'text-red-500' : 'text-secondary'}`}>
                           {report.type === 'emergency' ? 'CRITICAL SOS' : 'Global Intel'}
                         </span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed">{report.text}</p>
                   </div>
                </Popup>
             </CircleMarker>
          ))}
        </MapContainer>

        {/* Global Emergency Alert Banner */}
        <AnimatePresence>
          {communityReports.some(r => r.type === 'emergency') && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-0 left-0 right-0 z-[2000] bg-red-600/90 backdrop-blur-md px-12 py-3 border-b border-red-500/50 flex items-center justify-between"
            >
               <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white animate-pulse">
                     <Zap size={20} />
                  </div>
                  <div>
                     <h5 className="text-sm font-black text-white uppercase tracking-widest">Active SOS Emergency</h5>
                     <p className="text-[10px] text-white/70 font-bold">Tragedy/Incident reported in the sector. Emergency services are in transit - AVOID AREA.</p>
                  </div>
               </div>
               <Badge variant="danger" className="bg-white text-red-600 font-black border-none animate-bounce">PRIORITY 1</Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map UI Navigation Overlay */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-10 left-10 z-[1000] space-y-6"
        >
          <motion.div variants={itemVariants} className="glass-panel p-2 rounded-[1.5rem] flex flex-col gap-2 border border-white/10 shadow-2xl bg-[#0A0F19]/40 backdrop-blur-3xl">
             <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mt-1">Tactical Layers</span>
             <div className="flex gap-2">
               {['standard', 'heatmap', 'security'].map(layer => (
                 <button 
                   key={layer}
                   onClick={() => setMapLayer(layer)}
                   className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all duration-500 flex items-center gap-2 ${
                     mapLayer === layer 
                      ? 'bg-secondary text-slate-950 shadow-[0_0_20px_rgba(0,255,156,0.4)]' 
                      : 'text-white/30 hover:text-white'
                   }`}
                 >
                   {layer === 'standard' && <MapIcon size={12} />}
                   {layer === 'heatmap' && <Activity size={12} />}
                   {layer === 'security' && <Shield size={12} />}
                   {layer}
                 </button>
               ))}
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-2 rounded-[1.5rem] flex flex-col gap-2 border border-white/10 shadow-2xl bg-[#0A0F19]/40 backdrop-blur-3xl">
             <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mt-1">Active Sectors</span>
             <div className="flex gap-2">
               {[
                 { name: 'BLR', lat: 12.9716, lng: 77.5946 },
                 { name: 'DEL', lat: 28.6139, lng: 77.2090 },
                 { name: 'PUN', lat: 18.5204, lng: 73.8567 }
               ].map(city => (
                 <button 
                   key={city.name}
                   onClick={() => useStore.setState({ userLocation: { lat: city.lat, lng: city.lng } })}
                   className="px-4 py-2 rounded-2xl text-[10px] font-black text-white/40 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                 >
                   {city.name}
                 </button>
               ))}
             </div>
          </motion.div>

          <motion.button 
            variants={itemVariants}
            onClick={updateUserLocation}
            className="w-14 h-14 glass-panel rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all group shadow-2xl active:scale-90"
          >
             <Navigation size={22} className="group-hover:rotate-[360deg] transition-transform duration-700" />
          </motion.button>
        </motion.div>

        {/* Community Floating Toggles */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-10 right-10 z-[1000] flex flex-col gap-6"
        >
           <motion.button 
             variants={itemVariants}
             onClick={() => setIsCommunityOpen(!isCommunityOpen)}
             className="w-20 h-20 glass-panel rounded-[2rem] border border-primary/30 flex flex-col items-center justify-center text-primary hover:bg-primary/10 transition-all group shadow-2xl relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <MessageSquare size={28} className="relative z-10 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black uppercase mt-1 relative z-10">Intel</span>
              {communityReports.length > 0 && (
                 <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-[#04060A] animate-bounce" />
              )}
           </motion.button>
                      <motion.button 
             variants={itemVariants}
             className="w-20 h-20 glass-panel rounded-[2rem] border-white/10 flex flex-col items-center justify-center text-white/20 hover:text-white hover:border-white/30 transition-all shadow-2xl group"
            >
               <HelpCircle size={26} className="group-hover:rotate-12 transition-transform" />
               <span className="text-[9px] font-black uppercase mt-1">Guide</span>
            </motion.button>

            <motion.button 
              variants={itemVariants}
              onClick={() => {
                if (confirm("🚨 EMERGENCY SOS TACTICAL RESPONSE 🚨\n\nThis will instantly broadcast your coordinates to local Police and medical units. Are you sure you wish to trigger SOS?")) {
                  useStore.getState().triggerSOS();
                  import('sonner').then(({ toast }) => {
                    toast.error("SOS SIGNAL BROADCASTED", {
                      description: "Emergency units are tracking your signal. Stay in a safe zone.",
                      duration: 10000,
                    });
                  });
                }
              }}
              className="w-20 h-28 bg-red-600/20 border border-red-500/50 rounded-[2.5rem] flex flex-col items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse hover:animate-none group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:animate-shimmer" />
               <Zap size={32} className="relative z-10 group-hover:scale-125 transition-transform duration-500" />
               <span className="text-[10px] font-black uppercase mt-2 relative z-10 tracking-[0.2em]">SOS</span>
               <div className="absolute -bottom-2 w-12 h-1 bg-red-500 blur-md opacity-50" />
            </motion.button>
         </motion.div>

        {/* Dynamic Timeline Slider */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-10 right-10 z-[1000] flex items-center gap-8 px-12 py-6 glass-panel rounded-[3rem] border border-white/10 group overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
           <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Clock size={20} className="animate-pulse" />
              </div>
           </div>
           
           <div className="flex-1 relative h-3 bg-white/5 rounded-full border border-white/5">
             <input 
               type="range" 
               min="0" max="100" 
               value={historySlider}
               onChange={(e) => setHistorySlider(e.target.value)}
               className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
             />
             <motion.div 
               className="absolute top-0 bottom-0 bg-gradient-to-r from-primary/20 to-primary/60"
               style={{ width: `${historySlider}%` }}
             />
             <motion.div 
               className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-primary shadow-[0_0_20px_#00C2FF]"
               style={{ left: `${historySlider}%` }}
             />
           </div>
           
           <div className="relative flex flex-col items-end min-w-24">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Time Prediction</span>
              <span className="text-xl font-black text-white tabular-nums italic">T - {Math.round((100 - historySlider)/2)}<span className="text-primary not-italic font-bold ml-1">M</span></span>
           </div>
        </motion.div>

        {/* Tactical Status HUD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-40 right-10 z-[1000] space-y-4 hidden xl:block"
        >
           <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 bg-[#0A0F19]/60 backdrop-blur-xl w-64">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Neural Health</span>
                 <Activity size={12} className="text-primary animate-pulse" />
              </div>
              <div className="space-y-3">
                 <div>
                    <div className="flex justify-between text-[9px] font-black text-white/40 uppercase mb-1">
                       <span>Grid Stability</span>
                       <span className="text-primary">99.4%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '99.4%' }} className="h-full bg-primary shadow-[0_0_10px_#00C2FF]" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[9px] font-black text-white/40 uppercase mb-1">
                       <span>City Sentiment</span>
                       <span className="text-secondary">Optimal</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-secondary shadow-[0_0_10px_#00FF9C]" />
                    </div>
                 </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-5 h-5 rounded-full bg-white/10 border border-[#0A0F19] flex items-center justify-center text-[8px] font-bold text-white/40">
                          {i}
                       </div>
                    ))}
                 </div>
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Global Sync Active</span>
              </div>
           </div>
        </motion.div>
      </motion.div>

      {/* Community Feed Sidebar */}
      <CommunityFeed isOpen={isCommunityOpen} onClose={() => setIsCommunityOpen(false)} />

      {/* AI Assistant Chatbot */}
      <CrowdAssistant />

      {/* Side Profile Insights */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 z-[1000]"
          >
            <div className="w-[400px] max-h-[85vh] overflow-y-auto custom-scrollbar glass-panel p-8 rounded-[3rem] border-primary/20 relative shadow-[0_0_50px_rgba(0,194,255,0.1)] backdrop-blur-3xl bg-[#0A0F19]/80">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10 rounded-full" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white leading-none tracking-tight">{selectedLocation.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-black mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Live Area Intel
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-[1.2rem] bg-white/5 hover:bg-white/10 transition-all text-white/40 border border-white/5"
                >
                   <span className="text-lg">✕</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-end gap-4 px-2">
                   <div className="flex flex-col">
                     <span className="text-6xl font-black text-white font-futuristic tracking-tighter tabular-nums drop-shadow-lg">{Math.round(selectedLocation.density)}%</span>
                     <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Live Load</span>
                   </div>
                   <Badge variant={selectedLocation.density > 75 ? 'danger' : selectedLocation.density > 45 ? 'warning' : 'success'} className="mb-4 text-[9px] px-3 py-1">
                     {selectedLocation.density > 75 ? 'CRITICAL' : selectedLocation.density > 45 ? 'ELEVATED' : 'STABLE'}
                   </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 cyber-shimmer relative overflow-hidden group">
                    <span className="block text-[8px] text-white/40 font-black uppercase mb-1 tracking-widest">Peak Hours</span>
                    <span className="text-xs font-bold text-secondary">{predictions?.peakHours || '17:00 - 19:30'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </div>
                  <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 cyber-shimmer relative overflow-hidden group">
                    <span className="block text-[8px] text-white/40 font-black uppercase mb-1 tracking-widest">Occupancy</span>
                    <span className="text-xs font-bold text-primary">{predictions?.occupancy?.current || 'Live'} / {predictions?.occupancy?.capacity || 'Max'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </div>
                </div>

                <div className="p-5 bg-white/[0.02] rounded-[1.5rem] border border-white/5 hover:bg-white/[0.04] transition-all group">
                   <p className="text-[10px] text-white/30 font-black mb-2 flex items-center gap-2 tracking-[0.2em] uppercase">
                     <Clock size={12} className="text-primary group-hover:rotate-90 transition-transform duration-500" /> Intelligence Note
                   </p>
                   <p className="text-xs text-white/70 leading-relaxed font-medium">
                     {predictions?.explanation || `Sector [${selectedLocation.name}] is currently operating at ${Math.round(selectedLocation.density)}% capacity.`}
                   </p>
                </div>

                <div className="flex justify-between items-center px-2 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Sensors: {predictions?.liveSensors || 8} Active</span>
                  </div>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{predictions?.lastCheck || 'Just now'}</span>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <ReportCrowdButton locationId={selectedLocation.id} />

                  <button className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-white transition-all group cyber-shimmer">
                     Establish Route <MapIcon size={16} className="text-white/40 group-hover:text-white transition-colors group-hover:scale-110" />
                  </button>
                </div>

                {/* New Feature: User Insights Panel with Tabs */}
                <UserInsightsPanel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeatmapNode = React.memo(({ location, onClick, onHover, onLeave, isSelected, isAnomaly, mapLayer }) => {
  const color = 
    location.density > 75 ? '#FF4D4D' : 
    location.density > 45 ? '#FACC15' : 
    '#00FF9C';

  const radius = mapLayer === 'heatmap' ? 25 : (isSelected ? 14 : 10);
  const opacity = mapLayer === 'heatmap' ? (location.density / 150) + 0.2 : (isSelected ? 0.9 : 0.6);

  return (
    <>
      <AnimatePresence>
        {(isAnomaly || (mapLayer === 'security' && location.density > 80)) && (
          <CircleMarker
            center={[location.lat, location.lng]}
            radius={radius * 2}
            pathOptions={{
              color: '#FF4D4D',
              fillColor: '#FF4D4D',
              fillOpacity: 0.1,
              weight: 1,
              dashArray: '5,10',
              className: 'animate-pulse'
            }}
          />
        )}
      </AnimatePresence>
      <CircleMarker
         center={[location.lat, location.lng]}
         radius={radius}
         pathOptions={{ 
           color: isSelected ? '#00C2FF' : (isAnomaly ? '#FF4D4D' : 'transparent'),
           fillColor: color, 
           fillOpacity: opacity,
           weight: isSelected || isAnomaly ? 3 : 0,
           className: mapLayer === 'heatmap' ? 'blur-[2px]' : ''
         }}
         eventHandlers={{
           click: onClick,
           mouseover: onHover,
           mouseout: onLeave
         }}
      >
         <Popup>
           <div className="p-2 font-orbitron">
             <h4 className="font-black text-xs uppercase tracking-tighter">{location.name}</h4>
             <div className="h-1 w-full bg-white/10 rounded-full mt-1 mb-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${location.density}%` }} />
             </div>
             <p className="text-[10px] font-bold text-white/60">{Math.round(location.density)}% Density Detected</p>
           </div>
         </Popup>
      </CircleMarker>
    </>
  );
});
