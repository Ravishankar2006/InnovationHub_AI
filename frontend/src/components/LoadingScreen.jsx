import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    'Initializing AI Workforce...',
    'Connecting Agents...',
    'Loading Memory...',
    'Preparing Intelligence...',
    'Synergizing Operating System Core...',
    'OS Console Online.'
  ];

  useEffect(() => {
    // Progress interval
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + increment);
      });
    }, 150);

    // Status text interval
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 bg-[#070707] z-50 flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Background ambient glowing nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-radial from-[#D4AF37]/5 to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-8">
        
        {/* Glowing layered logo container */}
        <motion.div
          initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-20 h-20 flex items-center justify-center"
        >
          {/* Animated Gold Ring Halo */}
          <div className="absolute inset-0 border border-[#D4AF37]/35 rounded-2xl animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-2 border border-[#FFD95A]/15 rounded-xl animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />

          <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Layers className="w-7 h-7 text-black" />
          </div>
        </motion.div>

        {/* Title elements */}
        <div className="space-y-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-2xl font-black tracking-wider text-white"
          >
            InnovationHub AI
          </motion.h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[10px] uppercase font-bold text-[#AAAAAA] tracking-widest"
          >
            The Autonomous AI Co-Founder
          </motion.p>
        </div>

        {/* Progress details */}
        <div className="w-full space-y-3 pt-4">
          
          {/* Animated Text Status */}
          <div className="h-6 flex items-center justify-center">
            <motion.span
              key={statusIndex}
              initial={{ y: 10, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -10, opacity: 0, filter: 'blur(4px)' }}
              className="text-xs text-[#AAAAAA] font-medium"
            >
              {statuses[statusIndex]}
            </motion.span>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] shadow-[0_0_10px_rgba(212,175,55,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] uppercase font-mono text-zinc-600 font-bold px-1">
            <span>Core-Pipeline</span>
            <span>{progress}%</span>
          </div>

        </div>

      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <span className="text-[9px] uppercase font-mono text-zinc-600 tracking-widest font-bold">SECURE OPERATING SHELL</span>
      </div>

    </motion.div>
  );
}
