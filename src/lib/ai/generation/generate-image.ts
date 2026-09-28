import { registry } from '../providers/init'
import { createClient } from '@/utils/supabase/server'

interface ImageGenerationParams {
  prompt: string;
  modelId: string;
  parameters: any;
}

export async function generateImage(params: ImageGenerationParams) {
  const supabase = await createClient()
  
  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get model info
  const { data: model } = await supabase
    .from('ai_models')
    .select('slug, provider:provider_id(slug)')
    .eq('id', params.modelId)
    .single()

  if (!model) throw new Error('Model not found')
  
  const providerSlug = (model.provider as unknown as { slug: string }).slug

  // Create Generation Job Record in DB
  const { data: job, error: jobError } = await supabase
    .from('generation_jobs')
    .insert({
      requested_by: user.id,
      model_id: params.modelId,
      media_type: 'image',
      prompt: params.prompt,
      request_parameters: params.parameters,
      status: 'QUEUED'
    })
    .select()
    .single()

  if (jobError || !job) throw new Error('Failed to create generation job')

  try {
    const provider = registry.getImageProvider(providerSlug)
    // Delegate to provider
    const result = await provider.generateImage(params.prompt, params.parameters)
    
    // Update Job with provider Job ID
    await supabase
      .from('generation_jobs')
      .update({ provider_job_id: result.jobId, status: result.status })
      .eq('id', job.id)

    return { jobId: job.id, status: result.status }
  } catch (error: any) {
    // Record Failure
    await supabase
      .from('generation_jobs')
      .update({ status: 'FAILED', error_code: error.message || 'Unknown provider error' })
      .eq('id', job.id)
    throw error
  }
}
