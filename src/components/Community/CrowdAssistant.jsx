import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageSquare, Sparkles, ChevronRight, User, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getAIResponse } from '../../services/aiService';
import { Button } from '../ui';
import { toast } from 'sonner';

export const CrowdAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am your CrowdCheck Assistant. Ask me anything about city crowds or the best time to visit places!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { crowdData } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMsg = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(inputValue, crowdData);
      const botMsg = { id: Date.now() + 1, type: 'bot', text: aiResponse };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      toast.error("AI service failure");
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Is it busy at MG Road right now?",
    "Should I visit the Mall on Friday?",
    "What is the quietest path home?",
    "Identify current crowd risks."
  ];

  return (
    <>
      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 w-16 h-16 bg-primary rounded-3xl shadow-[0_0_30px_rgba(0,194,255,0.4)] flex items-center justify-center text-slate-950 hover:scale-110 active:scale-95 transition-all z-[2100] group"
      >
        <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all opacity-50" />
        <Bot size={28} className="relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#080B14] animate-pulse" />
      </button>

      {/* AI Assistant Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed bottom-32 right-32 w-full max-w-[400px] h-[600px] bg-[#0F1420]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] z-[2100] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                     <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white">AI Core</h3>
                     <p className="text-[10px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online • 1.2ms Latency
                     </p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-all">
                  <X size={20} />
               </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
               {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: m.type === 'bot' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${m.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                     <div className={`flex items-end gap-3 max-w-[85%] ${m.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                            m.type === 'bot' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-white/20'
                        }`}>
                           {m.type === 'bot' ? <Bot size={14} /> : <User size={14} />}
                        </div>
                        <div className={`p-4 text-sm font-medium leading-relaxed ${
                            m.type === 'bot' 
                             ? 'bg-white/[0.03] border border-white/5 rounded-[1.5rem] rounded-bl-none text-white/80' 
                             : 'bg-primary text-slate-950 font-bold rounded-[1.5rem] rounded-br-none'
                        }`}>
                           {m.text}
                        </div>
                     </div>
                  </motion.div>
               ))}
               {loading && (
                  <div className="flex justify-start">
                     <div className="flex items-center gap-3 bg-white/[0.03] p-4 rounded-3xl animate-pulse">
                        <Loader2 className="animate-spin text-primary" size={16} />
                        <span className="text-xs text-white/40 font-black uppercase">Thinking...</span>
                     </div>
                  </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-8 border-t border-white/5 shrink-0 bg-white/[0.01]">
               {messages.length < 3 && !loading && (
                  <div className="flex flex-wrap gap-2 mb-6">
                     {quickPrompts.map((p) => (
                        <button 
                          key={p} 
                          onClick={() => { setInputValue(p); }}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold text-white/40 hover:text-white transition-all"
                        >
                           {p}
                        </button>
                     ))}
                  </div>
               )}
               <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Ask me about city crowds..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-4 pr-16 text-sm text-white focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-white/20 font-medium"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || loading}
                    className="absolute right-2 w-12 h-12 bg-primary rounded-[1.2rem] flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 disabled:opacity-30 transition-all font-black shadow-lg shadow-primary/20"
                  >
                     <Send size={18} />
                  </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
