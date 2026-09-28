import { EmptyState } from '@/components/ui/EmptyState'
import { Activity } from 'lucide-react'

export function RecentActivity() {
  return (
    <div className="bg-white border border-nexus-border rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-nexus-primary mb-4">Recent Activity</h2>
      <EmptyState 
        icon={Activity} 
        title="No activity yet" 
        description="Your recent creative activity will appear here." 
      />
    </div>
  )
}
