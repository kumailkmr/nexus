import { CheckCircle2, Circle } from 'lucide-react'

export function SystemStatus() {
  const statuses = [
    { label: 'Supabase', status: 'CONNECTED', active: true },
    { label: 'Workspace', status: 'READY', active: true },
    { label: 'AI Providers', status: 'NOT CONFIGURED', active: false },
    { label: 'Storage', status: 'NOT CONFIGURED', active: false },
  ]

  return (
    <div className="bg-white border border-nexus-border rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-nexus-primary mb-4 uppercase tracking-wider">Nexus System</h2>
      <div className="flex flex-col gap-3">
        {statuses.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1 border-b border-nexus-border last:border-0">
            <span className="text-sm text-nexus-secondary-text">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.active ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-nexus-success" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-nexus-muted" />
              )}
              <span className={`text-xs font-mono font-medium ${item.active ? 'text-nexus-success' : 'text-nexus-muted'}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
