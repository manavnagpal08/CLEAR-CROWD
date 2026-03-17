import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Github, User, ChevronLeft } from 'lucide-react';
import { Button, Input, Badge } from '../../components/ui';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const loginStore = useStore(state => state.login);
  const loginWithGoogle = useStore(state => state.loginWithGoogle);
  const signupStore = useStore(state => state.signup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginStore(email, password);
      } else {
        await signupStore(name, email, password);
        toast.success('Access Granted', {
          description: `Neural signature recognized. Welcome, ${name}.`
        });
      }
    } catch (error) {
      setLoading(false);
      const errorMsg = error.code === 'auth/user-not-found' 
        ? 'Neural signature not found.' 
        : error.code === 'auth/wrong-password' 
        ? 'Security override failed: Incorrect credentials.' 
        : 'System error: Authentication node unreachable.';
        
      toast.error(isLogin ? 'Login Failed' : 'Registration Failed', {
        description: errorMsg
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setLoading(false);
      toast.error('Federated Sign-In Failed', {
        description: 'Google node authentication timeout.'
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#04060A] overflow-hidden">
      {/* Dynamic Data Stream Side Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-primary/[0.02] border-r border-white/5">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="scanline" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        
        <div className="relative z-10 flex flex-col items-center justify-center p-20 text-center w-full">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-10 border border-primary/30 cyber-glow-blue relative"
          >
             <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
             <Shield className="text-primary w-14 h-14 relative z-10" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-black mb-4 tracking-tighter italic glitch-hover cursor-default">
              Clear<span className="text-primary not-italic">Crowd</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-8">
               <span className="h-px w-8 bg-white/10" />
               <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white/30">AI Crowd Management</span>
               <span className="h-px w-8 bg-white/10" />
            </div>
            <p className="text-lg text-white/40 max-w-sm leading-relaxed font-medium">
              Real-time crowd monitoring and safety platform for smart cities.
            </p>
          </motion.div>
        </div>

        {/* Floating Data Particles */}
        <div className="absolute inset-0 pointer-events-none">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-primary/20 rounded-full"
               animate={{
                 y: [-20, 800],
                 x: Math.random() * 800,
                 opacity: [0, 0.5, 0]
               }}
               transition={{
                 duration: 4 + Math.random() * 4,
                 repeat: Infinity,
                 delay: i * 2,
                 ease: "linear"
               }}
             />
           ))}
        </div>
      </div>

      {/* Futuristic Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-12 relative z-10"
        >
          <div className="space-y-4">
            <Badge variant="info" className="mb-2 py-1 px-4 text-[9px] border-primary/20 bg-primary/5">Secure Connection</Badge>
            <h2 className="text-5xl font-black tracking-tight uppercase italic">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>
            <p className="text-white/30 font-medium tracking-wide">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Join ClearCrowd and stay safe today.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full h-16 glass-panel rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 border border-white/5 transition-all text-sm font-bold group cyber-shimmer"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em]">
              <span className="bg-[#04060A] px-6 text-white/20 italic">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest px-1">Full Name</label>
                  <input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 h-14 text-white outline-none focus:border-primary/50 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest px-1">Email Address</label>
              <input
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 h-14 text-white outline-none focus:border-primary/50 transition-all"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest px-1">Password</label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 h-14 text-white outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <Button size="lg" className="w-full h-16 font-black tracking-widest italic group cyber-glow-blue" isLoading={loading} type="submit">
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'} <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-xs text-white/30 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:text-primary transition-colors hover:underline underline-offset-8"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>

        {/* Fixed Footer Decoration */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
           <div className="h-1 w-12 bg-primary/20 rounded-full" />
           <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.5em]">
             System Core v2.0 • Build ID: RC-8921
           </p>
        </div>
      </div>
    </div>
  );
};
