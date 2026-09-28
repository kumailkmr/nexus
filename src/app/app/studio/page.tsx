import { StudioWorkspace } from '@/components/studio/StudioWorkspace'
import { createClient } from '@/utils/supabase/server'

export default async function StudioPage() {
  const supabase = await createClient()
  
  // We'll fetch models from the database later.
  // For now, we will pass down server data to the client component.
  const { data: models, error } = await supabase
    .from('ai_models')
    .select('id, name, slug, media_type, capabilities, provider:provider_id(name)')
    .eq('status', 'active')

  // If DB migration hasn't run yet, we'll provide mock data
  const safeModels = error ? [
    {
      id: 'mock-img-1',
      name: 'DALL-E 3',
      slug: 'dall-e-3',
      media_type: 'image',
      capabilities: { aspect_ratios: ['1:1', '16:9', '9:16'], qualities: ['standard', 'hd'] },
      provider: { name: 'OpenAI' }
    },
    {
      id: 'mock-vid-1',
      name: 'Higgsfield Video',
      slug: 'higgsfield-video-1',
      media_type: 'video',
      capabilities: { durations: [5, 10, 15], orientations: ['landscape', 'portrait'] },
      provider: { name: 'Higgsfield' }
    }
  ] : models

  return <StudioWorkspace models={safeModels || []} />
}
