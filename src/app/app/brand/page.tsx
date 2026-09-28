import { EmptyState } from '@/components/states/EmptyState'
import { Palette } from 'lucide-react'

export default function BrandPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-nexus-primary">Brand</h1>
      <EmptyState 
        icon={Palette} 
        title="Brand guidelines not set" 
        description="Configure your brand assets, fonts, and colors to maintain consistency." 
      />
    </div>
  )
}
