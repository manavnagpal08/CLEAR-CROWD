import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation, BarChart3, AlertTriangle, ArrowRight, MapIcon, Sparkles, CloudRain, Calendar, Bot } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Input, Badge } from '../ui';
import { crowdService } from '../../services/crowdService';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';

export const PredictionPanel = () => {
  const { 
    selectedLocation, setPredictions, predictions, setRoutes, routes,
    predictionFilters, setPredictionFilters, weather 
  } = useStore();
  
  const [isSearching, setIsSearching] = useState(false);
  const [dest, setDest] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    if (selectedLocation) {
      crowdService.getPredictions(selectedLocation.id, {
        includeEvents: predictionFilters.includeEvents,
        includeWeather: predictionFilters.includeWeather,
        weather: weather.type
      }).then(setPredictions);
      setIsMinimized(false);
    }
  }, [selectedLocation, setPredictions, predictionFilters, weather]);

  const handleRouteSearch = async () => {
    if (!dest) return;
    setIsSearching(true);
    const results = await crowdService.getSafeRoutes('Current', dest);
    setRoutes(results);
    setIsSearching(false);
    setIsMinimized(false);
  };

  return (
    <div className={`fixed lg:right-10 lg:top-24 bottom-0 lg:bottom-10 left-0 right-0 lg:left-auto lg:w-[400px] flex flex-col gap-4 lg:gap-6 z-30 transition-all duration-500 ${isMinimized ? 'translate-y-[calc(100%-80px)] lg:translate-y-0' : 'translate-y-0'}`}>
      
      {/* Mobile Handle */}
      <div 
        className="lg:hidden w-full h-20 bg-[#080B14] rounded-t-[2rem] border-t border-white/5 flex items-center justify-center cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="w-12 h-1.5 bg-white/10 rounded-full mb-2" />
      </div>

      {/* Floating Action Button for Mobile Toggle */}
      <button 
        onClick={() => setIsMinimized(!isMinimized)}
        className="lg:hidden absolute -top-16 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl text-slate-950 pointer-events-auto"
      >
        {isMinimized ? <Navigation size={20} /> : <ArrowRight size={20} className="rotate-90" />}
      </button>

      {/* Route Selection - Layered Panel */}
      <div className="glass-panel lg:rounded-[2.5rem] p-6 lg:p-8 pointer-events-auto border-white/5 shadow-2xl overflow-y-auto max-h-[50vh] lg:max-h-[45%] custom-scrollbar bg-[#080B14] lg:bg-transparent">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Navigation className="text-secondary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Find Routes</h2>
            <p className="text-[10px] text-white/30 uppercase font-black">Get the best path</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input 
            placeholder="Where are you going?" 
            value={dest}
            onChange={e => setDest(e.target.value)}
            className="h-12 border-white/5"
          />
          <Button 
            className="w-full h-12 rounded-2xl" 
            isLoading={isSearching}
            onClick={handleRouteSearch}
          >
            Find Best Routes
          </Button>
        </div>

        <AnimatePresence>
          {routes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 space-y-3"
            >
              {routes.map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{route.title}</h4>
                    <span className="text-[10px] tabular-nums font-black" style={{ color: route.color }}>{route.safetyScore}% Safety</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold mb-3 uppercase tracking-tighter">
                    <span>{route.eta}</span>
                    <span>•</span>
                    <span>{route.distance}</span>
                    <Badge variant={route.safetyScore > 80 ? 'success' : 'warning'}>{route.crowdLevel}</Badge>
                  </div>
                  <p className="text-[10px] text-white/30 leading-snug line-clamp-2 italic">{route.reason}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Prediction Insights */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="glass-panel rounded-[2.5rem] p-8 flex-1 pointer-events-auto border-white/5 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Crowd Forecast</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">For: {selectedLocation.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setPredictionFilters({ includeEvents: !predictionFilters.includeEvents })}
                   className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${predictionFilters.includeEvents ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/20 border border-white/5'}`}
                   title="Toggle Events Layer"
                 >
                    <Calendar size={14} />
                 </button>
                 <button 
                    onClick={() => setPredictionFilters({ includeWeather: !predictionFilters.includeWeather })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${predictionFilters.includeWeather ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-white/5 text-white/20 border border-white/5'}`}
                    title="Toggle Weather Layer"
                 >
                    <CloudRain size={14} />
                 </button>
              </div>
            </div>

            {/* Environmental Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
               {predictionFilters.includeWeather && (
                 <Badge variant="info" className="bg-blue-500/10 border-blue-500/20 text-[8px]">
                   {weather.label} Active
                 </Badge>
               )}
               {predictionFilters.includeEvents && (
                 <Badge variant="warning" className="bg-yellow-500/10 border-yellow-500/20 text-[8px]">
                   Event Factor Active
                 </Badge>
               )}
            </div>

            <div className="flex-1 min-h-[160px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictions?.chartData || []}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F1420', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#00C2FF' }}
                    cursor={{ stroke: 'rgba(0, 194, 255, 0.2)', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00C2FF" 
                    strokeWidth={4} 
                    dot={false}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                    <span className="block text-[10px] text-white/30 font-bold uppercase mb-1">Risk Index</span>
                    <span className="text-xl font-black text-primary">{predictions?.riskScore || '...'}</span>
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-secondary/30 transition-all">
                    <span className="block text-[10px] text-white/30 font-bold uppercase mb-1">Peak Time</span>
                    <span className="text-sm font-black text-secondary uppercase">{predictions?.peakHours || '17:00-19:00'}</span>
                  </div>
               </div>

               {/* Detailed Stats Grid */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] text-white/30 font-bold uppercase">Occupancy</span>
                      <span className="text-[10px] text-primary font-black">{predictions?.occupancy?.percentage}%</span>
                    </div>
                    <div className="text-lg font-black">{predictions?.occupancy?.current} / {predictions?.occupancy?.capacity}</div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${predictions?.occupancy?.percentage}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5">
                    <span className="block text-[10px] text-white/30 font-bold uppercase mb-1">Trend</span>
                    <div className="text-sm font-bold text-white/70">{predictions?.historicalTrend}</div>
                    <div className="text-[10px] text-white/20 mt-1 uppercase">vs Last 24h</div>
                  </div>
               </div>

               {/* Crowd Composition */}
               <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="text-[10px] font-black uppercase text-white/40 mb-4 tracking-widest">Demographic Mix</h4>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-4">
                    {predictions?.composition?.map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        style={{ backgroundColor: item.color }}
                        className="h-full"
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {predictions?.composition?.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[9px] font-bold text-white/40 uppercase">{item.label}</span>
                        <span className="text-[9px] font-black text-white/60">{item.value}%</span>
                      </div>
                    ))}
                  </div>
               </div>
               
               <p className="text-xs text-white/50 leading-relaxed italic p-4 bg-primary/5 rounded-2xl border border-primary/10">
                 "{predictions?.explanation}"
               </p>

               <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Live Sensors: {predictions?.liveSensors || 8}</span>
                  </div>
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Updated: {predictions?.lastCheck || 'Just now'}</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
