import { EmptyState } from '@/components/states/EmptyState'
import { CheckSquare } from 'lucide-react'

export default function ReviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-nexus-primary">Review</h1>
      <EmptyState 
        icon={CheckSquare} 
        title="No pending reviews" 
        description="All creative assets have been reviewed and approved." 
      />
    </div>
  )
}
