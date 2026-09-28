'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { MobileMoreSheet } from './MobileMoreSheet'
import { NAVIGATION_CONFIG } from '../navigation/navigation-config'

export function MobileBottomNav({ user }: { user: any }) {
  const pathname = usePathname()
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const mainNavItems = NAVIGATION_CONFIG.filter(item => item.mobilePriority && item.mobileVisible)

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-nexus-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full text-nexus-secondary-text active:bg-nexus-surface transition-colors"
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon 
                  className={`w-[22px] h-[22px] mb-1 ${
                    isActive 
                      ? 'text-nexus-blue fill-nexus-blue/10' 
                      : 'text-nexus-muted'
                  }`} 
                />
                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-nexus-blue' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          <button
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full text-nexus-secondary-text active:bg-nexus-surface transition-colors focus:outline-none"
          >
            <Menu className="w-[22px] h-[22px] mb-1 text-nexus-muted" />
            <span className="text-[10px] font-semibold tracking-wide">
              More
            </span>
          </button>
        </div>
      </div>

      <MobileMoreSheet 
        isOpen={isMoreOpen} 
        onClose={() => setIsMoreOpen(false)} 
        user={user}
      />
    </>
  )
}
