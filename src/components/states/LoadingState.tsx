import { Loader2 } from 'lucide-react'

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-48 w-full">
      <Loader2 className="w-8 h-8 text-nexus-blue animate-spin mb-4" />
      <p className="text-sm font-medium text-nexus-secondary-text">{message}</p>
    </div>
  )
}
