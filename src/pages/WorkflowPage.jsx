import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Share2, Shield, Zap, Satellite, Activity, Globe, MessageSquare, Bot } from 'lucide-react';

export const WorkflowPage = () => {
    const steps = [
        {
            icon: <Satellite className="text-primary" size={32} />,
            title: "Data Acquisition",
            desc: "Ingesting real-time signals from 55+ urban IoT sensors, satellite imagery, and municipal traffic feeds.",
            tags: ["IoT Mesh", "Satellite Feed", "City API"]
        },
        {
            icon: <Database className="text-secondary" size={32} />,
            title: "Neural Processing",
            desc: "Data is normalized and passed through our secondary processing layer to filter noise and identify trends.",
            tags: ["Normalization", "Vector DB", "Storage"]
        },
        {
            icon: <Bot className="text-purple-400" size={32} />,
            title: "AI Analysis",
            desc: "Generative AI engines analyze current density vs historical patterns to predict future crowd movements.",
            tags: ["Predictive AI", "Anomaly Detection", "NLP"]
        },
        {
            icon: <Activity className="text-amber-400" size={32} />,
            title: "Insights Generation",
            desc: "Converting raw predictions into actionable user advice like 'Should I Go?' and 'Best Time Finder'.",
            tags: ["Decision Engine", "Temporal Analysis"]
        },
        {
            icon: <Shield className="text-red-500" size={32} />,
            title: "Tactical Response",
            desc: "Automatic triggering of SOS protocols and emergency routing when high-risk anomalies are detected.",
            tags: ["Emergency Protocol", "Safe Escape"]
        }
    ];

    return (
        <div className="h-full w-full bg-[#080B14] p-6 md:p-10 overflow-y-auto custom-scrollbar relative overflow-hidden">
            {/* Premium Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20" />
            
            <div className="max-w-6xl mx-auto pb-32 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-20 text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4 font-orbitron">
                        SYSTEM <span className="text-primary not-italic">ARCHITECTURE</span>
                    </h1>
                    <p className="text-white/40 text-sm md:text-lg font-medium max-w-2xl mx-auto px-4">
                        How ClearCrowd transforms raw urban signals into life-saving tactical intelligence.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-red-500/50 hidden lg:block opacity-20" />
                    
                    <div className="space-y-24">
                        {steps.map((step, i) => (
                            <motion.div 
                                key={step.title}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                            >
                                <div className="flex-1 text-center lg:text-right w-full">
                                    <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] glass-panel border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <div className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4 ${i % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
                                            <h3 className="text-2xl md:text-3xl font-black italic text-white group-hover:text-primary transition-colors font-orbitron">{step.title}</h3>
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shrink-0">
                                                {step.icon}
                                            </div>
                                        </div>
                                        
                                        <p className="text-white/50 text-xs md:text-base leading-relaxed mb-6 md:mb-8">
                                            {step.desc}
                                        </p>
                                        
                                        <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
                                            {step.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-[#080B14] border-4 border-white/10 z-10 flex items-center justify-center text-white/20 font-black italic">
                                        0{i + 1}
                                    </div>
                                    <div className="absolute w-32 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />
                                </div>
                                
                                <div className="flex-1 hidden lg:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 md:mt-32 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] glass-panel border-primary/20 bg-primary/5 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <Zap className="text-primary mx-auto mb-6" size={32} md:size={48} />
                    <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase mb-4 tracking-tighter font-orbitron leading-tight">Live Deployment Successful</h2>
                    <p className="text-white/40 text-xs md:text-base max-w-xl mx-auto font-medium px-4">
                        ClearCrowd is currently monitoring <span className="text-primary">3 Major Metros</span> with a combined sensor network of over <span className="text-secondary">160+ Tactical Nodes</span>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
