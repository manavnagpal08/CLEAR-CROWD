import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={twMerge(
        'glass-panel rounded-[2rem] p-6 transition-all duration-500 overflow-hidden',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
