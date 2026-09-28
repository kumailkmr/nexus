import React from 'react'
import { RoboticGuide } from './RoboticGuide'

interface AuthShellProps {
  children: React.ReactNode
  robotState: any
}

export function AuthShell({ children, robotState }: AuthShellProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-24">
      {/* Mobile-centric logo placement */}
      <div className="flex justify-center lg:hidden mb-8 w-full">
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05),0_0_0_1px_rgba(228,231,236,1)] overflow-hidden">
          <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-2xl leading-none tracking-tighter">N</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
        <div className="w-full max-w-md bg-white rounded-2xl border border-nexus-border shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative z-10">
          {children}
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 justify-start">
        <RoboticGuide state={robotState} />
      </div>
    </div>
  )
}
