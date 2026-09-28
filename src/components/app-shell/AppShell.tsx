'use client'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileBottomNav } from './MobileBottomNav'

export function AppShell({ children, user }: { children: React.ReactNode, user: any }) {
  return (
    <div className="flex h-screen w-full bg-nexus-bg overflow-hidden relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col h-full min-w-0 overflow-hidden pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0"
      >
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8" id="main-content">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav user={user} />
    </div>
  )
}
