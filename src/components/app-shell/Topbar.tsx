'use client'

import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'
import { GlobalSearch } from './GlobalSearch'
import { Bell } from 'lucide-react'

export function Topbar({ user }: { user: any }) {
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
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="lg:hidden w-8 h-8 bg-nexus-primary rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg leading-none">N</span>
        </div>
        <h1 className="text-base lg:text-sm font-semibold text-nexus-primary">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <GlobalSearch />
        <button className="hidden lg:flex p-2 text-nexus-secondary-text hover:text-nexus-primary hover:bg-nexus-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-blue transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-nexus-border hidden lg:block mx-1" />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
