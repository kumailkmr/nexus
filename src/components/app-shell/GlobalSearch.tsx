'use client'

import { Search as SearchIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-nexus-secondary hover:bg-nexus-surface border border-nexus-border rounded-lg text-nexus-secondary-text transition-colors focus:outline-none focus:ring-2 focus:ring-nexus-blue w-64 justify-between"
      >
        <div className="flex items-center gap-2">
          <SearchIcon className="w-4 h-4 text-nexus-muted" />
          <span className="text-sm">Search NEXUS...</span>
        </div>
        <div className="flex items-center gap-1 opacity-70">
          <kbd className="font-sans text-xs bg-white border border-nexus-border rounded px-1.5 py-0.5">⌘</kbd>
          <kbd className="font-sans text-xs bg-white border border-nexus-border rounded px-1.5 py-0.5">K</kbd>
        </div>
      </button>

      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-nexus-secondary-text hover:text-nexus-primary focus:outline-none focus:ring-2 focus:ring-nexus-blue rounded-lg"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
          <div 
            className="fixed inset-0 bg-nexus-primary/30 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-nexus-border flex flex-col">
            <div className="flex items-center px-4 py-3 border-b border-nexus-border">
              <SearchIcon className="w-5 h-5 text-nexus-muted shrink-0" />
              <input 
                autoFocus
                placeholder="Search NEXUS..."
                className="w-full bg-transparent border-none text-nexus-primary px-3 py-1 focus:outline-none focus:ring-0 placeholder:text-nexus-muted"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-semibold tracking-wider text-nexus-secondary-text bg-nexus-secondary hover:bg-nexus-surface px-2 py-1 rounded border border-nexus-border ml-2 uppercase"
              >
                ESC
              </button>
            </div>
            <div className="p-8 text-center bg-nexus-secondary/30">
              <p className="text-sm text-nexus-secondary-text">
                Search is currently limited to your active workspace. Full global search capabilities will be enabled soon.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
