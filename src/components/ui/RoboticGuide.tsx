'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type GuideState = 'idle' | 'pointing' | 'looking-email' | 'looking-password' | 'looking-button' | 'activating'

interface RoboticGuideProps {
  state: GuideState
  className?: string
}

export function RoboticGuide({ state, className = '' }: RoboticGuideProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isDesktop) return null

  // Animation variants
  const headVariants: any = shouldReduceMotion ? {
    idle: { rotate: 0, y: 0 },
    pointing: { rotate: 0, y: 0 },
    'looking-email': { rotate: 0, y: 0, x: 0 },
    'looking-password': { rotate: 0, y: 0, x: 0 },
    'looking-button': { rotate: 0, y: 0, x: 0 },
    activating: { rotate: 0, y: 0, scale: 1 },
  } : {
    idle: { rotate: 0, y: [0, -4, 0], transition: { y: { repeat: Infinity, duration: 4, ease: 'easeInOut' } } },
    pointing: { rotate: -15, y: -2, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    'looking-email': { rotate: 10, y: 5, x: -10, transition: { duration: 0.8, ease: 'easeOut' } },
    'looking-password': { rotate: 15, y: 15, x: -5, transition: { duration: 0.8, ease: 'easeOut' } },
    'looking-button': { rotate: 20, y: 25, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    activating: { rotate: 0, y: -10, scale: 1.05, transition: { duration: 0.4 } },
  }

  const eyeVariants: any = {
    idle: { scaleY: 1 },
    pointing: { scaleY: 0.8, opacity: 1, filter: 'drop-shadow(0 0 8px rgba(21, 94, 239, 0.8))' },
    'looking-email': { scaleY: 1, opacity: 0.8 },
    'looking-password': { scaleY: 1, opacity: 0.8 },
    'looking-button': { scaleY: 1, opacity: 0.8 },
    activating: { scaleY: 1.2, opacity: 1, filter: 'drop-shadow(0 0 12px rgba(0, 184, 217, 1))' },
  }

  const armVariants: any = {
    idle: { rotate: 15, x: 0, y: 0, transition: { duration: 1 } },
    pointing: { rotate: -45, x: -40, y: -20, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    'looking-email': { rotate: 20, x: 0, y: 5, transition: { duration: 0.8 } },
    'looking-password': { rotate: 25, x: 0, y: 10, transition: { duration: 0.8 } },
    'looking-button': { rotate: 30, x: 0, y: 15, transition: { duration: 0.8 } },
    activating: { rotate: -10, x: -10, y: -10, transition: { duration: 0.4 } },
  }

  const particleVariants: any = {
    idle: { opacity: 0, x: 0 },
    pointing: { opacity: [0, 1, 0], x: [-20, -100], transition: { duration: 1.5, ease: 'easeOut' } },
    'looking-email': { opacity: 0 },
    'looking-password': { opacity: 0 },
    'looking-button': { opacity: 0 },
    activating: { opacity: [0, 1, 0], scale: [0.5, 2], transition: { duration: 0.5 } },
  }

  return (
    <div className={`relative w-[400px] h-[500px] flex items-center justify-center ${className}`}>
      {/* Abstract sleek robot composition */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial="idle"
        animate={state}
      >
        {/* Head */}
        <motion.div 
          variants={headVariants}
          className="relative w-32 h-40 bg-gradient-to-b from-white to-nexus-surface rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.05),inset_0_-4px_10px_rgba(0,0,0,0.02)] border border-white/50 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Inner Faceplate */}
          <div className="w-24 h-28 bg-[#0a0f18] rounded-3xl relative flex items-center justify-center shadow-inner overflow-hidden">
            {/* Subtle reflection */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl" />
            
            {/* Eye / Sensor */}
            <motion.div 
              variants={eyeVariants}
              className="w-12 h-3 bg-nexus-cyan rounded-full shadow-[0_0_15px_rgba(0,184,217,0.5)]"
            />
          </div>
          
          {/* Neck joint */}
          <div className="absolute -bottom-4 w-12 h-6 bg-nexus-border rounded-b-xl -z-10" />
        </motion.div>

        {/* Torso/Chassis (abstract) */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          className="mt-6 w-48 h-56 bg-gradient-to-b from-white to-nexus-secondary rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 relative"
        >
          {/* Core light */}
          <motion.div 
            animate={{ opacity: state === 'activating' ? 1 : 0.4 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-nexus-blue rounded-full shadow-[0_0_20px_rgba(21,94,239,0.6)]"
          />
        </motion.div>

        {/* Floating Arm / Hand */}
        <motion.div 
          variants={armVariants}
          className="absolute top-48 -left-12 w-20 h-8 bg-gradient-to-r from-white to-nexus-surface rounded-full shadow-lg border border-white origin-right flex items-center"
        >
          <div className="w-6 h-6 ml-2 bg-nexus-blue/20 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-nexus-blue rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Pointing visual cue particles */}
      <motion.div 
        variants={particleVariants}
        initial="idle"
        animate={state}
        className="absolute top-[210px] left-[80px] w-12 h-1 bg-gradient-to-r from-nexus-blue to-transparent rounded-full opacity-0 blur-[1px]"
      />
      
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(21,94,239,0.03)_0%,transparent_70%)] rounded-full -z-10" />
    </div>
  )
}
