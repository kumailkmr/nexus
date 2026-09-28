'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AuthShell } from '@/components/ui/AuthShell'

export default function InitializePage() {
  const [robotState, setRobotState] = useState<'idle' | 'pointing' | 'activating'>('idle')

  useEffect(() => {
    // Initial entrance animation triggers pointing after a short delay
    const timer = setTimeout(() => {
      setRobotState('pointing')
      setTimeout(() => setRobotState('idle'), 2000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthShell robotState={robotState}>
      <div className="p-8 lg:p-12 w-full relative flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="absolute top-6 left-8 hidden lg:block">
           <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm overflow-hidden border border-nexus-border">
             <span className="text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-sm tracking-tighter">N</span>
           </div>
        </div>

        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="px-3 py-1 bg-nexus-surface border border-nexus-border rounded-full text-[10px] font-semibold tracking-widest uppercase text-nexus-secondary-text mb-4">
            Private Creative Operating System
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tighter text-nexus-primary uppercase">
            Welcome to<br />Nexus
          </h1>
          <p className="text-sm text-nexus-secondary-text mt-4 max-w-[280px] leading-relaxed">
            Your private workspace for AI-powered creative production, content systems, campaigns and intelligent workflows.
          </p>
        </div>

        <Link 
          href="/initialize/sign-in"
          onMouseEnter={() => setRobotState('pointing')}
          onMouseLeave={() => setRobotState('idle')}
          onClick={() => setRobotState('activating')}
          className="group w-full flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(21,94,239,0.2)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2"
        >
          Initialize Nexus
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </AuthShell>
  )
}
