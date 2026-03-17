import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Camera, ThumbsUp, MapPin, X, Send, Image as ImageIcon, ArrowRight, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Input, Badge } from '../ui';
import { toast } from 'sonner';

export const CommunityFeed = ({ isOpen, onClose }) => {
  const { communityReports, submitReport, userLocation } = useStore();
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportDensity, setReportDensity] = useState(50);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    // Simulate image upload by using a random Unsplash URL for now
    // In a real app, this would upload to Firebase Storage
    const randomImages = [
      'https://images.unsplash.com/photo-1540959733332-e94e270b4d82?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514525253361-b83f8a9e27c1?auto=format&fit=crop&w=800&q=80'
    ];
    setSelectedImage(randomImages[Math.floor(Math.random() * randomImages.length)]);
    toast.success('Image analyzed by AI!', {
      description: 'Crowd density detected from visual data.'
    });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportText) return;

    try {
      await submitReport({
        text: reportText,
        density: reportDensity,
        imageUrl: selectedImage,
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setReportText('');
      setSelectedImage(null);
      setIsReporting(false);
      toast.success('Report Shared!', {
        description: 'Thank you for helping the community.'
      });
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-[#080B14]/95 backdrop-blur-3xl border-l border-white/5 z-[2000] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <MessageSquare className="text-primary" /> Community <span className="text-primary">Live</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Real-time Public Intel</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/40"
            >
              <X size={20} />
            </button>
          </div>

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Quick Report Trigger */}
            {!isReporting ? (
              <button 
                onClick={() => setIsReporting(true)}
                className="w-full p-6 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-between hover:bg-primary/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-slate-950 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      <Camera size={20} />
                   </div>
                   <div className="text-left">
                      <p className="font-bold text-white">Seen a crowd?</p>
                      <p className="text-xs text-primary/60 font-medium">Share an update and help others.</p>
                   </div>
                </div>
                <ArrowRight className="text-primary" size={20} />
              </button>
            ) : (
              <motion.form 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleReportSubmit}
                className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-2">
                   <h3 className="font-black text-white flex items-center gap-2">
                      <Send size={16} className="text-primary" /> New Update
                   </h3>
                   <button type="button" onClick={() => setIsReporting(false)} className="text-white/20 hover:text-white transition-all">
                      <X size={14} />
                   </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-white/30 tracking-widest">Density Level: {reportDensity}%</label>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={reportDensity}
                      onChange={(e) => setReportDensity(e.target.value)}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="relative">
                    <textarea 
                      placeholder="What's the situation? (e.g., Station is very busy right now)"
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-primary/40 transition-all resize-none"
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      required
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                       <button 
                         type="button"
                         onClick={handleImageUpload}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            selectedImage ? 'bg-secondary text-slate-950' : 'bg-white/10 text-white/40 hover:bg-white/20'
                         }`}
                       >
                          {selectedImage ? <ThumbsUp size={18} /> : <ImageIcon size={18} />}
                       </button>
                    </div>
                  </div>

                  {selectedImage && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                       <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <Badge variant="success" className="absolute bottom-3 left-3">AI Analyzed</Badge>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-14 font-black rounded-2xl">
                    Post to Community <Send size={18} className="ml-2" />
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Reports List */}
            <div className="space-y-8 pt-4">
               {communityReports.length === 0 && (
                  <div className="py-20 text-center space-y-3 opacity-30">
                     <MapPin size={48} className="mx-auto" />
                     <p className="font-bold">No reports yet</p>
                     <p className="text-xs">Be the first to share an update!</p>
                  </div>
               )}

               {communityReports.map((report, idx) => (
                  <motion.div 
                    key={report.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group space-y-4"
                  >
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                              <User size={20} className="text-white/20" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white">Commander {report.userName.split(' ')[0]}</p>
                              <p className="text-[10px] text-white/30 font-black uppercase tracking-tight">Verified Public User</p>
                           </div>
                        </div>
                        <span className="text-[9px] text-white/20 font-black tabular-nums">Just now</span>
                     </div>

                     <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 group-hover:border-primary/20 transition-all shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                           <Badge variant={report.density > 75 ? 'danger' : 'success'}>
                              {report.density}% Busy
                           </Badge>
                           <span className="text-[10px] text-white/40 flex items-center gap-1 font-bold">
                              <MapPin size={10} className="text-primary" /> Nearby
                           </span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed italic mb-4">
                           "{report.text}"
                        </p>
                        {report.imageUrl && (
                           <div className="rounded-[2rem] overflow-hidden border border-white/5 mb-4 shadow-2xl">
                              <img src={report.imageUrl} alt="User Upload" className="w-full hover:scale-105 transition-transform duration-700" />
                           </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-t border-white/5 pt-4">
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20 hover:text-secondary transition-all">
                              <ThumbsUp size={12} /> Helpful (0)
                           </button>
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20 hover:text-primary transition-all">
                              <MessageSquare size={12} /> Reply
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
