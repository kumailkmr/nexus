'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { NAVIGATION_CONFIG, NavSection } from '../navigation/navigation-config'

const SECTIONS: NavSection[] = ['WORKSPACE', 'OPERATIONS', 'BUSINESS', 'SYSTEM']

export function Sidebar({ mobile, onClose }: { mobile?: boolean, onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r border-nexus-border w-64 shrink-0 overflow-y-auto">
      <div className="h-16 flex items-center px-6 border-b border-nexus-border justify-between shrink-0">
        <Link href="/app" className="flex items-center gap-3 focus:outline-none">
          <div className="w-8 h-8 bg-nexus-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">N</span>
          </div>
          <span className="font-bold tracking-widest text-sm text-nexus-primary">NEXUS</span>
        </Link>
        {mobile && onClose && (
          <button onClick={onClose} className="p-2 -mr-2 text-nexus-secondary-text hover:text-nexus-primary rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 py-6 px-3 flex flex-col gap-6">
        {SECTIONS.map((section) => {
          const items = NAVIGATION_CONFIG.filter(item => item.section === section && item.desktopVisible)
          if (items.length === 0) return null
          
          return (
            <div key={section}>
              <h3 className="px-3 text-xs font-semibold text-nexus-muted uppercase tracking-wider mb-2">
                {section}
              </h3>
              <div className="flex flex-col gap-1">
                {items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== '/app'
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-nexus-surface text-nexus-primary' 
                          : 'text-nexus-secondary-text hover:bg-nexus-secondary hover:text-nexus-primary'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-nexus-blue' : 'text-nexus-muted'}`} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
