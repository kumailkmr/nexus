import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-nexus-border border-dashed bg-nexus-secondary">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-nexus-border">
        <Icon className="w-6 h-6 text-nexus-muted" />
      </div>
      <h3 className="text-sm font-semibold text-nexus-primary mb-1">{title}</h3>
      <p className="text-sm text-nexus-secondary-text mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  )
}
