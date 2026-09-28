'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, X } from 'lucide-react'
import { signOut } from '@/app/initialize/actions'
import { NAVIGATION_CONFIG } from '../navigation/navigation-config'

export function MobileMoreSheet({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  const pathname = usePathname()
  const sheetRef = useRef<HTMLDivElement>(null)
  
  const moreNavItems = NAVIGATION_CONFIG.filter(item => !item.mobilePriority && item.mobileVisible)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const name = user?.user_metadata?.full_name || 'NEXUS User'
  const email = user?.email || ''

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-nexus-primary/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className="relative bg-white w-full rounded-t-3xl shadow-2xl border-t border-nexus-border flex flex-col max-h-[85vh]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        role="dialog"
        aria-modal="true"
        aria-label="More navigation options"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-nexus-border rounded-full" />
        </div>
        
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-nexus-primary">More</h2>
            <p className="text-xs text-nexus-secondary-text truncate">{email}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-nexus-surface flex items-center justify-center text-nexus-secondary-text hover:text-nexus-primary focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="flex flex-col gap-1 py-2">
            {moreNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive 
                      ? 'bg-nexus-surface text-nexus-primary' 
                      : 'text-nexus-secondary-text active:bg-nexus-surface'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-nexus-blue' : 'text-nexus-muted'}`} />
                  {item.label}
                </Link>
              )
            })}
          </div>
          
          <div className="my-2 border-t border-nexus-border" />
          
          <div className="py-2 mb-4">
            <button 
              onClick={() => {
                onClose()
                signOut()
              }}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium text-red-600 active:bg-red-50 transition-colors focus:outline-none"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
