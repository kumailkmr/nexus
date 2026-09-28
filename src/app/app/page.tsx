import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import { MetricCards } from '@/components/dashboard/MetricCards'
import { WorkspaceShortcuts } from '@/components/dashboard/WorkspaceShortcuts'
import { ActiveProjects } from '@/components/dashboard/ActiveProjects'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { SystemStatus } from '@/components/dashboard/SystemStatus'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nexus-primary mb-1">
            Good morning, {firstName}
          </h1>
          <p className="text-sm text-nexus-secondary-text">
            Your creative workspace at a glance.
          </p>
        </div>
        
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-5 py-3 sm:py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-md shadow-nexus-blue/10 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2 shrink-0">
          <Plus className="w-4 h-4" />
          CREATE
        </button>
      </div>

      <MetricCards />
      
      <WorkspaceShortcuts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActiveProjects />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          <RecentActivity />
          <SystemStatus />
        </div>
      </div>
    </div>
  )
}
