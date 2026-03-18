import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui';
import { CommunityFeed } from '../Community/CommunityFeed';
import { CrowdAssistant } from '../Community/CrowdAssistant';
import { MessageSquare, Clock, Map as MapIcon, Navigation, HelpCircle, Bot, Zap, Activity, Shield, ArrowRight } from 'lucide-react';
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
    userLocation, updateUserLocation, fetchCommunityReports, predictions, anomalies,
    avoidMode, setAvoidMode, searchQuery, setSearchQuery
  } = useStore();

  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [mapLayer, setMapLayer] = useState('standard'); // 'standard' | 'heatmap' | 'security'
  const [isFeatureHubOpen, setIsFeatureHubOpen] = useState(true);

  useEffect(() => {
    updateUserLocation();
    fetchCommunityReports();
    const interval = setInterval(() => {
        const { lat, lng } = useStore.getState().userLocation;
        fetchCrowdData(lat, lng);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    let data = crowdData;
    if (searchQuery) {
      data = data.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (avoidMode) {
      data = data.filter(loc => loc.density < 55);
    }
    return data;
  }, [crowdData, searchQuery, avoidMode]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative w-full h-full bg-[#020408] overflow-hidden flex items-center justify-center p-2 md:p-6 lg:p-8">
      {/* Decision Banner - Proactive AI Advice */}
      <AnimatePresence>
        {filteredData.some(l => l.density > 70) && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-32 left-1/2 -translate-x-1/2 z-[1900] w-full max-w-lg px-4"
          >
            <div className="bg-orange-500/95 backdrop-blur-md text-slate-950 px-8 py-3 rounded-2xl flex items-center justify-between border border-orange-400/50 shadow-[0_10px_30px_rgba(249,115,22,0.3)]">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Smart Advice</span>
                    <span className="text-xs font-bold truncate max-w-[250px]">
                      {filteredData.find(l => l.density > 70)?.name} is currently crowded. Best time to visit: 7:30 PM
                    </span>
                  </div>
               </div>
               <button className="text-[9px] font-black uppercase tracking-widest hover:underline px-4">Details</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar - Smart Search */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-xl px-4"
      >
        <div className="glass-premium h-16 rounded-full flex items-center px-6 gap-4 border border-white/5 group focus-within:border-primary/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={18} />
          </div>
          <input 
            type="text"
            placeholder="Search streets, parks or malls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-white/20 tracking-wide"
          />
          <Badge variant="info" className="hidden sm:block text-[8px] bg-white/5 border-white/10 text-white/40">AI ASSISTANT</Badge>
        </div>
      </motion.div>

      {/* Main Map Core */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative w-full h-full rounded-[3rem] lg:rounded-[4.5rem] border border-white/5 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,1)] glass-premium"
      >
        <MapContainer 
          center={[userLocation.lat, userLocation.lng]} 
          zoom={14} 
          style={{ width: '100%', height: '100%', background: '#020408', zIndex: 1 }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            opacity={0.8}
          />
          
          <MapController />

          {/* User Marker */}
          <CircleMarker 
            center={[userLocation.lat, userLocation.lng]} 
            radius={8} 
            pathOptions={{ color: '#00C2FF', fillColor: '#00C2FF', fillOpacity: 1, weight: 2 }}
          />

          {/* Crowd Heatmap Layers */}
          {filteredData.map((loc) => (
             <HeatmapNode 
                key={loc.id} 
                location={loc} 
                isSelected={selectedLocation?.id === loc.id}
                isAnomaly={anomalies.some(a => a.locationId === loc.id)}
                mapLayer={mapLayer}
                onClick={() => setSelectedLocation(loc)}
                onHover={() => setHoveredLocation(loc)}
                onLeave={() => setHoveredLocation(null)}
             />
          ))}

          {/* Reports & Incidents */}
          {communityReports.map((report, i) => (
             <CircleMarker 
                key={`report-${i}`}
                center={[report.lat, report.lng]} 
                radius={report.type === 'emergency' ? 30 : 15} 
                pathOptions={{ 
                  color: report.type === 'emergency' ? '#FF3B3B' : '#00FF9C', 
                  fillColor: report.type === 'emergency' ? '#FF3B3B' : '#00FF9C',
                  fillOpacity: report.type === 'emergency' ? 0.4 : 0.2, 
                  weight: 3, 
                  className: report.type === 'emergency' ? 'animate-pulse' : ''
                }}
             />
          ))}
        </MapContainer>

        {/* Action Panels */}
        <div className="absolute top-10 left-10 right-10 flex justify-between items-start z-[1500] pointer-events-none">
          <motion.div variants={itemVariants} className="pointer-events-auto flex flex-col gap-4">
             {/* Time Selector */}
             <div className="flex bg-[#0A0F19]/80 p-1.5 glass-panel rounded-full border border-white/10 shadow-3xl backdrop-blur-xl">
                {['live', '30m', '60m'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                      viewMode === mode 
                       ? 'bg-primary text-slate-950 font-black' 
                       : 'text-white/20 hover:text-white/60'
                    }`}
                  >
                    {mode === 'live' ? 'Now' : `+${mode}`}
                  </button>
                ))}
             </div>

             {/* City Regions */}
             <div className="glass-panel p-1.5 md:p-2 rounded-[1.2rem] md:rounded-[1.5rem] flex flex-col gap-1.5 md:gap-2 border border-white/5 shadow-2xl bg-[#0A0F19]/60 backdrop-blur-3xl">
                <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mt-1">Active Cities</span>
                <div className="flex gap-1.5 md:gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { name: 'BLR', lat: 12.9716, lng: 77.5946 },
                    { name: 'DEL', lat: 28.6139, lng: 77.2090 },
                    { name: 'PUN', lat: 18.5204, lng: 73.8567 },
                    { name: 'CCU', lat: 22.5726, lng: 88.3639 },
                    { name: 'MAA', lat: 13.0827, lng: 80.2707 }
                  ].map(city => (
                    <button 
                      key={city.name}
                      onClick={() => useStore.setState({ userLocation: { lat: city.lat, lng: city.lng } })}
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-white/40 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 shrink-0 uppercase"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pointer-events-auto flex flex-col gap-4 items-end">
             {/* Layer Controls */}
             <div className="flex bg-[#0A0F19]/80 p-1.5 glass-panel rounded-full border border-white/10 shadow-3xl gap-1 backdrop-blur-xl">
                {['standard', 'heatmap', 'security'].map(layer => (
                  <button 
                    key={layer}
                    onClick={() => setMapLayer(layer)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      mapLayer === layer 
                       ? 'bg-secondary text-slate-950 shadow-[0_0_20px_rgba(0,255,156,0.3)]' 
                       : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {layer === 'standard' && <MapIcon size={18} />}
                    {layer === 'heatmap' && <Activity size={18} />}
                    {layer === 'security' && <Shield size={18} />}
                  </button>
                ))}
             </div>
          </motion.div>
        </div>

        {/* AI Assistant Hub - Left Panel */}
        <AnimatePresence>
          {isFeatureHubOpen && (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute left-10 top-32 bottom-32 w-80 z-[1500] pointer-events-auto hidden xl:flex flex-col gap-6"
            >
              <div className="glass-premium p-8 rounded-[3rem] border border-white/5 flex flex-1 flex-col shadow-3xl bg-[#020408]/40 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] font-orbitron italic text-primary">AI Assistant Hub</h4>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[8px] font-black text-secondary tracking-widest uppercase">Live Analysis</span>
                   </div>
                </div>

                <div className="space-y-6 flex-1">
                  {/* One-Tap Avoid Mode */}
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all cursor-pointer shadow-lg" onClick={() => setAvoidMode(!avoidMode)}>
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Shield size={20} />
                       </div>
                       <div className={`w-10 h-5 rounded-full p-1 transition-colors ${avoidMode ? 'bg-primary' : 'bg-white/10'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${avoidMode ? 'translate-x-5' : 'translate-x-0'}`} />
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Avoid Crowds Now</span>
                    <p className="text-[8px] text-white/30 uppercase mt-1">Automatically filtering busy zones</p>
                  </div>

                  {/* Proactive Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                       <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-1">Safety Level</span>
                       <span className="text-sm font-black text-secondary uppercase italic">Optimal</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                       <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-1">Reliability</span>
                       <span className="text-sm font-black text-primary italic leading-none">99.4%</span>
                    </div>
                  </div>

                  {/* Personal Assistant Input */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-2">Personal Assistant</label>
                      <div className="relative">
                         <input 
                           type="text" 
                           placeholder="Where should I go?" 
                           className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl px-5 text-[10px] text-white placeholder:text-white/20 outline-none focus:border-primary/40 transition-all font-bold"
                         />
                         <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                           <ArrowRight size={14} />
                         </button>
                      </div>
                    </div>
                    
                    <button className="w-full h-14 bg-white/5 rounded-2xl flex items-center px-6 gap-4 group hover:bg-primary transition-all border border-transparent hover:border-primary/20 shadow-sm">
                       <Activity size={16} className="text-primary group-hover:text-slate-950" />
                       <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-slate-950">City Pulse Mode</span>
                    </button>
                    <button className="w-full h-14 bg-white/5 rounded-2xl flex items-center px-6 gap-4 group hover:bg-secondary transition-all shadow-sm">
                       <Navigation size={16} className="text-secondary group-hover:text-slate-950" />
                       <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-slate-950">Smartest Route</span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full border-2 border-[#020408] bg-white/10" />)}
                   </div>
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">4.2k Active Users</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Slider HUD */}
        <motion.div 
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1500] w-full max-w-5xl px-10 pointer-events-none"
        >
          <div className="glass-premium p-8 rounded-[3.5rem] border border-white/10 flex items-center gap-10 shadow-3xl bg-[#0A0F19]/80 backdrop-blur-2xl pointer-events-auto overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
             
             <div className="flex flex-col items-start min-w-[150px]">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 leading-none">Crowd Prediction</span>
                <div className="flex items-center gap-3 mt-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_#00C2FF]" />
                   <span className="text-4xl font-black text-white italic font-orbitron tabular-nums leading-none tracking-tighter">
                     {historySlider === 0 ? 'LIVE' : `+${Math.round(historySlider * 0.6)}m`}
                   </span>
                </div>
             </div>

             <div className="flex-1 relative pb-8 pt-2">
                <div className="flex justify-between mb-4 px-2 opacity-40">
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Normal Flow</span>
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Stability Node</span>
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">High Prediction</span>
                </div>
                <div className="relative h-3 bg-white/5 rounded-full border border-white/5 overflow-hidden group">
                   <input 
                     type="range" 
                     min="0" max="100" 
                     value={historySlider}
                     onChange={(e) => setHistorySlider(parseInt(e.target.value))}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className="absolute top-0 bottom-0 bg-primary" style={{ width: `${historySlider}%` }} />
                   <div className="absolute top-0 bottom-0 left-0 right-0 glass-shimmer pointer-events-none" />
                </div>
                {/* Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                   {['Now', '+30 min', '+60 min'].map((label, i) => (
                     <div key={i} className="flex flex-col items-center">
                        <div className="w-px h-2 bg-white/20 mb-1" />
                        <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">{label}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/10 min-w-[150px] justify-center">
                <Clock size={20} className="text-secondary" />
                <div className="flex flex-col">
                   <span className="text-xl font-black text-white font-orbitron tabular-nums leading-none">
                     {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                   <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-1">System Time</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Floating Actions */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 z-[1500] flex flex-col gap-6">
           <button 
             onClick={updateUserLocation}
             className="w-16 h-16 rounded-[2.2rem] glass-premium flex items-center justify-center text-primary border border-primary/20 hover:bg-primary hover:text-slate-950 transition-all hover:rotate-[360deg] duration-700 shadow-2xl"
           >
              <Navigation size={24} />
           </button>
           <button 
             onClick={() => setIsFeatureHubOpen(!isFeatureHubOpen)}
             className={`w-16 h-16 rounded-[2.2rem] glass-premium flex items-center justify-center border border-white/10 transition-all hover:scale-110 shadow-2xl ${isFeatureHubOpen ? 'text-secondary' : 'text-white/30'}`}
           >
              <HelpCircle size={24} />
           </button>
        </div>
      </motion.div>

      {/* Overlays */}
      <CommunityFeed isOpen={isCommunityOpen} onClose={() => setIsCommunityOpen(false)} />
      <CrowdAssistant />

      {/* Detailed Insights Panel */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[500px] z-[3000] p-4 sm:p-10 pointer-events-none"
          >
             <div className="h-full glass-premium pointer-events-auto rounded-[3.5rem] bg-[#020408]/90 backdrop-blur-3xl border border-primary/20 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] overflow-y-auto custom-scrollbar p-10 relative">
                <div className="flex items-start justify-between mb-12">
                   <div className="pr-6">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                         <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em]">Live Area Insights</span>
                      </div>
                      <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase font-orbitron leading-tight">{selectedLocation.name}</h3>
                   </div>
                   <button 
                      onClick={() => setSelectedLocation(null)}
                      className="w-14 h-14 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/5 flex items-center justify-center transition-all group"
                   >
                      <span className="text-xl group-hover:rotate-90 transition-transform">✕</span>
                   </button>
                </div>

                <div className="space-y-10">
                   {/* Deep Metrics */}
                    <div className="flex items-center gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                       <div className="flex flex-col">
                          <span className="text-[70px] font-black text-white italic leading-none font-orbitron">{Math.round(selectedLocation.density)}%</span>
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-2">Crowd Intensity</span>
                       </div>
                      <div className="h-20 w-px bg-white/10" />
                      <div className="space-y-3">
                         <Badge variant={selectedLocation.density > 75 ? 'danger' : selectedLocation.density > 45 ? 'warning' : 'success'} className="px-5 py-2 text-[10px] font-black">
                            {selectedLocation.density > 75 ? 'SURGE ALERT' : selectedLocation.density > 45 ? 'BUSY' : 'STABLE'}
                         </Badge>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{selectedLocation.type}</span>
                            <span className="text-[8px] font-black text-primary uppercase mt-1">Explainable AI: Weekend Peak</span>
                         </div>
                      </div>
                   </div>

                   {/* AI Features Integration */}
                   <UserInsightsPanel />

                   {/* Quick Actions */}
                   <div className="pt-6 flex gap-4">
                      <ReportCrowdButton locationId={selectedLocation.id} />
                      <button className="flex-1 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center gap-4 group hover:bg-white hover:text-slate-950 transition-all font-black text-[10px] uppercase tracking-widest">
                         <Navigation size={18} />
                         Establish Link
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeatmapNode = React.memo(({ location, onClick, onHover, onLeave, isSelected, isAnomaly, mapLayer }) => {
  const d = location.density;
  
  // High Intensity Color Scaling
  const color = 
    d > 80 ? '#FF1E1E' : // Critical Red
    d > 60 ? '#FF8A00' : // High Warning
    d > 45 ? '#FFD600' : // Caution
    d > 25 ? '#00FF9C' : // Stable
    '#00C2FF';           // Low

  // Radial spread (Reduced clutter)
  const baseRadius = mapLayer === 'heatmap' ? 25 + (d / 2) : (isSelected ? 20 : 15);
  const opacity = mapLayer === 'heatmap' ? (d / 100) * 0.5 + 0.1 : (isSelected ? 1 : 0.6);

  return (
    <>
      <AnimatePresence>
        {(isAnomaly || (mapLayer === 'security' && d > 75)) && (
          <CircleMarker
            center={[location.lat, location.lng]}
            radius={baseRadius * 2.2}
            pathOptions={{
              color: '#FF1E1E',
              fillColor: '#FF1E1E',
              fillOpacity: 0.05,
              weight: 1,
              dashArray: '10,20',
              className: 'animate-pulse'
            }}
          />
        )}
      </AnimatePresence>

      {mapLayer === 'heatmap' && (
        <>
          {/* Secondary Glow */}
          <CircleMarker
            center={[location.lat, location.lng]}
            radius={baseRadius * 2}
            pathOptions={{
              fillColor: color,
              fillOpacity: opacity * 0.15,
              stroke: false,
              className: 'blur-[15px] transition-all duration-1000'
            }}
          />
          {/* Primary Glow */}
          <CircleMarker
            center={[location.lat, location.lng]}
            radius={baseRadius * 1.3}
            pathOptions={{
              fillColor: color,
              fillOpacity: opacity * 0.3,
              stroke: false,
              className: 'blur-[8px] transition-all duration-700'
            }}
          />
        </>
      )}

      {/* Core Node */}
      <CircleMarker
         center={[location.lat, location.lng]}
         radius={baseRadius}
         pathOptions={{ 
           color: isSelected ? '#FFFFFF' : 'transparent',
           fillColor: color, 
           fillOpacity: opacity,
           weight: isSelected ? 3 : 0,
           className: mapLayer === 'heatmap' ? 'blur-[1px]' : ''
         }}
         eventHandlers={{
           click: onClick,
           mouseover: onHover,
           mouseout: onLeave
         }}
      >
         <Popup>
            <div className="p-4 bg-[#020408]/95 backdrop-blur-2xl border border-white/5 rounded-[2rem] w-56 shadow-2xl">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-2">{location.name}</h4>
              <div className="flex items-end justify-between mb-5">
                 <div className="flex flex-col">
                    <span className="text-4xl font-black text-white leading-none font-orbitron">{Math.round(location.density)}%</span>
                    <span className="text-[8px] font-black text-white/20 uppercase mt-1 tracking-widest">Load</span>
                 </div>
                 <Badge variant={location.density > 75 ? 'danger' : 'info'} className="text-[8px] h-fit py-1 px-3">
                   {location.density > 75 ? 'AVOID' : 'OPTIMAL'}
                 </Badge>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${location.density}%` }}
                   className="h-full bg-primary" 
                 />
              </div>
              <p className="text-[9px] text-primary/60 font-black italic uppercase tracking-wider">Better time: +2h</p>
            </div>
         </Popup>
      </CircleMarker>
    </>
  );
});
