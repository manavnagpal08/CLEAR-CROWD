import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Button = ({ children, className, variant = 'primary', size = 'md', isLoading, ...props }) => {
  const variants = {
    primary: 'bg-[#00C2FF] text-[#080B14] hover:shadow-[0_0_20px_rgba(0,194,255,0.4)]',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20',
    ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base font-bold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        'rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">{label}</label>}
      <input
        className={twMerge(
          'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 focus:border-[#00C2FF]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#00C2FF]/30',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export const Badge = ({ children, variant = 'info', className }) => {
  const variants = {
    info: 'bg-[#00C2FF]/10 text-[#00C2FF] border-[#00C2FF]/20',
    success: 'bg-[#00FF9C]/10 text-[#00FF9C] border-[#00FF9C]/20',
    warning: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={twMerge(
      'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
