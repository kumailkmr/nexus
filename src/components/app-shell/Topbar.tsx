'use client'

import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'
import { Menu } from 'lucide-react'

export function Topbar({ user, onOpenMobileMenu }: { user: any, onOpenMobileMenu: () => void }) {
  const pathname = usePathname()
  
  // Format pathname into title
  const pathParts = pathname.split('/').filter(Boolean)
  let title = 'Dashboard'
  if (pathParts.length > 1) {
    const lastPart = pathParts[pathParts.length - 1]
    title = lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
  }

  return (
    <header className="h-16 border-b border-nexus-border bg-white flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 text-nexus-secondary-text hover:text-nexus-primary focus:outline-none focus:ring-2 focus:ring-nexus-blue rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold text-nexus-primary">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <UserMenu user={user} />
      </div>
    </header>
  )
}
