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
    <div className="min-h-screen flex selection:bg-primary/30 relative overflow-hidden bg-[#020408]">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-float opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
      </div>

      {/* Dynamic Visual Side (Left) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden z-10 border-r border-white/5">
        <div className="absolute inset-0 bg-[#04060A]/40 backdrop-blur-sm" />
        <div className="scanline opacity-10" />
        
        <div className="relative z-20 flex flex-col items-start justify-center p-24 w-full">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="w-20 h-20 glass-premium rounded-3xl flex items-center justify-center mb-12 border-primary/30 group hover:shadow-[0_0_50px_rgba(0,194,255,0.3)] transition-all duration-700"
          >
             <Shield className="text-primary w-10 h-10 group-hover:scale-110 transition-transform" />
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="space-y-6"
          >
            <h1 className="text-8xl font-black mb-2 tracking-tighter italic font-orbitron leading-none">
              CLEAR<br />
              <span className="text-primary not-italic text-outline-glow">CROWD</span>
            </h1>
            
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-primary rounded-full" />
               <span className="text-[12px] uppercase font-black tracking-[0.6em] text-white/40">Crowd Intelligence v4.0</span>
            </div>

            <p className="text-xl text-white/50 max-w-md leading-relaxed font-medium mt-8">
              Real-time crowd insights for a <span className="text-primary font-black italic">Smarter, Safer City</span>.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-12">
               <div className="space-y-2 border-l border-white/10 pl-6">
                  <span className="text-3xl font-black text-white italic">160+</span>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">City Data Points</p>
               </div>
               <div className="space-y-2 border-l border-white/10 pl-6">
                  <span className="text-3xl font-black text-secondary italic">99.4%</span>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">System Accuracy</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Neural Grid Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute bg-primary/40 rounded-full"
               style={{ 
                 width: Math.random() * 4 + 1 + 'px', 
                 height: Math.random() * 4 + 1 + 'px',
                 top: Math.random() * 100 + '%',
                 left: Math.random() * 100 + '%'
               }}
               animate={{
                 opacity: [0, 1, 0],
                 scale: [0.5, 1.5, 0.5],
                 y: [0, -100]
               }}
               transition={{
                 duration: 3 + Math.random() * 5,
                 repeat: Infinity,
                 delay: Math.random() * 5
               }}
             />
           ))}
        </div>
      </div>

      {/* Auth Side (Right) */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative z-20">
        <div className="absolute inset-0 bg-[#020408]/60 backdrop-blur-xl lg:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg relative z-20"
        >
          <div className="glass-premium p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] cyber-shimmer group relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="space-y-2 mb-8 md:mb-12">
               <Badge variant="info" className="mb-4 py-1.5 px-6 text-[9px] md:text-[10px] bg-primary/10 border-primary/20 animate-pulse text-glow uppercase tracking-widest">Secure Access</Badge>
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic drop-shadow-2xl font-orbitron">
                 {isLogin ? 'Login' : 'Sign Up'}
               </h2>
               <p className="text-white/40 text-sm font-medium tracking-tight">
                 {isLogin ? 'Welcome back to ClearCrowd.' : 'Create an account to join the network.'}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name-field"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[10px] uppercase font-black text-white/20 tracking-widest ml-2 italic">Full Name</label>
                      <div className="relative group">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                         <input
                           placeholder="Enter your name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           required={!isLogin}
                           className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] pl-16 pr-8 h-16 text-white text-sm font-bold outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all placeholder:text-white/10"
                         />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black text-white/20 tracking-widest ml-2 italic">Email Address</label>
                   <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        placeholder="your@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] pl-16 pr-8 h-16 text-white text-sm font-bold outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all placeholder:text-white/10"
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black text-white/20 tracking-widest ml-2 italic">Password</label>
                   <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        placeholder="••••••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] pl-16 pr-8 h-16 text-white text-sm font-bold outline-none focus:bg-white/[0.06] focus:border-primary/50 transition-all placeholder:text-white/10"
                      />
                   </div>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <Button size="lg" className="w-full h-20 font-black tracking-[0.2em] italic text-md group/btn bg-primary hover:bg-white transition-all shadow-3xl shadow-primary/20 border-none rounded-[2.5rem]" isLoading={loading} type="submit">
                  <span className="flex items-center gap-3">
                    {isLogin ? 'LOG IN' : 'SIGN UP'} 
                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </span>
                </Button>

                <div className="flex items-center gap-4">
                   <div className="h-px flex-1 bg-white/5" />
                   <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">Or continue with</span>
                   <div className="h-px flex-1 bg-white/5" />
                </div>

                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-16 glass-premium hover:bg-white/5 rounded-3xl border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 group transition-all shadow-xl"
                  >
                    <svg viewBox="0 0 48 48" className="w-6 h-6 group-hover:scale-110 transition-transform">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.91 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.02-10.36 7.02-17.65z"/>
                      <path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    Continue with Google
                  </button>
              </div>
            </form>
          </div>

          <div className="mt-12 text-center space-y-4">
             <p className="text-xs text-white/30 font-medium">
               {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
               <button 
                 onClick={() => setIsLogin(!isLogin)}
                 className="text-primary font-black uppercase tracking-widest hover:text-white transition-all ml-2 underline-offset-8 hover:underline"
               >
                 {isLogin ? 'Sign Up' : 'Log In'}
               </button>
             </p>

             <p className="text-[10px] text-white/5 uppercase font-black tracking-[0.6em] mt-20">
               ClearCrowd System • v2.4.0
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
