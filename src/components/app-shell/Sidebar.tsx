'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Wand2, FolderOpen, Target, 
  FileText, Image as ImageIcon, Calendar, 
  Users, CheckSquare, BarChart3, Settings,
  X
} from 'lucide-react'

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
      { name: 'Studio', href: '/app/studio', icon: Wand2 },
      { name: 'Projects', href: '/app/projects', icon: FolderOpen },
      { name: 'Campaigns', href: '/app/campaigns', icon: Target },
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Content', href: '/app/content', icon: FileText },
      { name: 'Assets', href: '/app/assets', icon: ImageIcon },
      { name: 'Calendar', href: '/app/calendar', icon: Calendar },
    ]
  },
  {
    title: 'Business',
    items: [
      { name: 'Clients', href: '/app/clients', icon: Users },
      { name: 'Approvals', href: '/app/approvals', icon: CheckSquare },
      { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/app/settings', icon: Settings },
    ]
  }
]

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
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-xs font-semibold text-nexus-muted uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-nexus-surface text-nexus-primary' 
                        : 'text-nexus-secondary-text hover:bg-nexus-secondary hover:text-nexus-primary'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-nexus-blue' : 'text-nexus-muted'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
