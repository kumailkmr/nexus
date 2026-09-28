import { EmptyState } from '@/components/states/EmptyState'
import { TrendingUp } from 'lucide-react'

export default function ProfitPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-nexus-primary">Profit</h1>
      <EmptyState 
        icon={TrendingUp} 
        title="No profit data" 
        description="Your campaign and client profitability metrics will appear here." 
      />
    </div>
  )
}
