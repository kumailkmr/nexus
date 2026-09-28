import { EmptyState } from '@/components/states/EmptyState'
import { DollarSign } from 'lucide-react'

export default function CostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-nexus-primary">Costs</h1>
      <EmptyState 
        icon={DollarSign} 
        title="No cost data" 
        description="Your AI generation and operation costs will appear here." 
      />
    </div>
  )
}
