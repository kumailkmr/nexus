import { Image as ImageIcon, Video, FileText, FolderPlus, Target } from 'lucide-react'

export function QuickAccess() {
  const actions = [
    { label: 'Create Image', icon: ImageIcon },
    { label: 'Create Video', icon: Video },
    { label: 'Create Content', icon: FileText },
    { label: 'New Project', icon: FolderPlus },
    { label: 'New Campaign', icon: Target },
  ]

  return (
    <div className="bg-white border border-nexus-border rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-nexus-primary mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((action, i) => (
          <button key={i} className="flex flex-col items-center justify-center p-4 rounded-lg border border-nexus-border bg-nexus-secondary hover:bg-nexus-surface hover:border-nexus-muted transition-all gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white border border-nexus-border flex items-center justify-center group-hover:shadow-sm transition-all">
              <action.icon className="w-5 h-5 text-nexus-muted group-hover:text-nexus-blue transition-colors" />
            </div>
            <span className="text-xs font-medium text-nexus-primary">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
