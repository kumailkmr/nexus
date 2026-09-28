'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import { signOut } from '@/app/initialize/actions'
import Link from 'next/link'

export function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const name = user?.user_metadata?.full_name || 'NEXUS User'
  const email = user?.email || ''
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-nexus-blue rounded-full p-1 -mr-1 hover:bg-nexus-secondary transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-nexus-surface border border-nexus-border flex items-center justify-center text-xs font-medium text-nexus-primary">
          {initials}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-nexus-border py-1 z-50">
          <div className="px-4 py-3 border-b border-nexus-border">
            <p className="text-sm font-medium text-nexus-primary truncate">{name}</p>
            <p className="text-xs text-nexus-secondary-text truncate">{email}</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/app/settings" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-nexus-secondary-text hover:bg-nexus-secondary hover:text-nexus-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link 
              href="/app/settings" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-nexus-secondary-text hover:bg-nexus-secondary hover:text-nexus-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
          
          <div className="py-1 border-t border-nexus-border">
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
