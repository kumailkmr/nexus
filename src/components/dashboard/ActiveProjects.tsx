import { EmptyState } from '@/components/ui/EmptyState'
import { FolderOpen } from 'lucide-react'

export function ActiveProjects() {
  return (
    <div className="bg-white border border-nexus-border rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-nexus-primary mb-4">Active Projects</h2>
      <EmptyState 
        icon={FolderOpen} 
        title="No active projects" 
        description="Create a project to organize your creative work." 
        action={
          <button className="px-4 py-2 bg-nexus-surface text-nexus-primary text-sm font-medium rounded-lg border border-nexus-border hover:bg-nexus-border transition-colors">
            Create your first project
          </button>
        }
      />
    </div>
  )
}
