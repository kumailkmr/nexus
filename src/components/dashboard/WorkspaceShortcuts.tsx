import { Wand2, FileText, Target, Image as ImageIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function WorkspaceShortcuts() {
  const shortcuts = [
    {
      title: 'Studio',
      description: 'Generate and manage AI-powered creative work.',
      href: '/app/studio',
      icon: Wand2,
    },
    {
      title: 'Content',
      description: 'Plan, create and organize content.',
      href: '/app/content',
      icon: FileText,
    },
    {
      title: 'Campaigns',
      description: 'Coordinate campaigns and creative deliverables.',
      href: '/app/campaigns',
      icon: Target,
    },
    {
      title: 'Assets',
      description: 'Manage your creative library.',
      href: '/app/assets',
      icon: ImageIcon,
    },
  ]

  return (
    <div className="bg-white border border-nexus-border rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-nexus-primary mb-4">Creative Workspace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shortcuts.map((shortcut, i) => (
          <Link 
            key={i}
            href={shortcut.href}
            className="group flex flex-col p-4 rounded-xl border border-nexus-border bg-nexus-secondary hover:bg-nexus-surface hover:border-nexus-muted transition-all text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-nexus-border flex items-center justify-center group-hover:shadow-sm transition-all">
                <shortcut.icon className="w-5 h-5 text-nexus-muted group-hover:text-nexus-blue transition-colors" />
              </div>
              <ArrowRight className="w-4 h-4 text-nexus-muted group-hover:text-nexus-blue transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-sm font-bold text-nexus-primary mb-1">{shortcut.title}</h3>
            <p className="text-xs text-nexus-secondary-text leading-relaxed">{shortcut.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
