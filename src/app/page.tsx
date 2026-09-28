"use client";

import { motion, MotionConfig, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NexusLandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } 
    },
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-nexus-bg font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 subtle-grid opacity-30 mask-radial-faded" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nexus-blue/5 rounded-full blur-[100px] opacity-70" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full p-6 sm:p-8 z-20 flex items-center"
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05),0_0_0_1px_rgba(228,231,236,1)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_8px_24px_rgba(21,94,239,0.15)] group-hover:border-nexus-blue/30 group-hover:ring-2 group-hover:ring-nexus-blue/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-nexus-surface/40 to-transparent pointer-events-none" />
            <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-xl leading-none tracking-tighter">N</span>
          </div>
          <span className="font-bold tracking-[0.2em] text-[15px] text-nexus-primary uppercase transition-colors duration-500 group-hover:text-nexus-blue">NEXUS</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[700px] flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block px-3 py-1 bg-nexus-surface border border-nexus-border rounded-full text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-nexus-secondary-text">
              AI Creative Studio
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold tracking-tighter text-nexus-primary mb-6 leading-[1.1]"
          >
            NEXUS
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-nexus-secondary-text mb-10 max-w-[600px] leading-relaxed mx-auto"
          >
            NEXUS is a unified workspace for creating, managing, delivering, and measuring AI-powered creative work.
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <Link 
              href="/initialize"
              className="group flex items-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-8 py-4 rounded-lg text-[13px] sm:text-sm font-semibold uppercase tracking-wide transition-all shadow-md shadow-nexus-blue/20 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2"
            >
              Initialize Nexus
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* System Metadata */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-20 flex justify-between items-end md:items-center text-nexus-secondary-text font-mono text-[10px] sm:text-[11px] uppercase tracking-wider opacity-60"
      >
        <div className="flex flex-col md:flex-row gap-2 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
            System Ready
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse delay-75" />
            AI Engine Ready
          </div>
        </div>
        <div className="text-right">
          NEXUS 01
        </div>
      </motion.footer>

    </div>
    </MotionConfig>
  );
}
