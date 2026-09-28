'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { generateImage } from '@/lib/ai/generation/generate-image'
import { generateVideo } from '@/lib/ai/generation/generate-video'

const CostRequestSchema = z.object({
  modelId: z.string().uuid(),
  mediaType: z.enum(['image', 'video']),
  duration: z.number().optional(),
  orientation: z.string().optional(),
  quality: z.string().optional()
})

export async function calculateGenerationCost(params: z.infer<typeof CostRequestSchema>) {
  const result = CostRequestSchema.safeParse(params)
  if (!result.success) {
    return { error: 'Invalid calculation parameters' }
  }

  const { modelId, mediaType, duration } = result.data

  const supabase = await createClient()
  
  const { data: pricing, error } = await supabase
    .from('ai_model_pricing')
    .select(`
      currency,
      billing_type,
      base_cost,
      cost_per_second,
      cost_per_image,
      cost_per_generation,
      id
    `)
    .eq('model_id', modelId)
    .eq('active', true)
    .single()

  if (error || !pricing) {
    return { error: 'Cost estimate unavailable' }
  }

  let totalCost = 0
  
  if (pricing.billing_type === 'per_image') {
    totalCost = Number(pricing.base_cost) + Number(pricing.cost_per_image)
  } else if (pricing.billing_type === 'per_second') {
    totalCost = Number(pricing.base_cost) + (Number(duration || 0) * Number(pricing.cost_per_second))
  } else {
    totalCost = Number(pricing.cost_per_generation)
  }

  return {
    cost: totalCost,
    currency: pricing.currency,
    pricingReference: pricing.id
  }
}

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000),
  modelId: z.string().uuid(),
  mediaType: z.enum(['image', 'video']),
  parameters: z.any()
})

export async function generateAsset(params: z.infer<typeof GenerateRequestSchema>) {
  const result = GenerateRequestSchema.safeParse(params)
  if (!result.success) {
    return { error: 'Invalid generation parameters' }
  }

  try {
    const { prompt, modelId, mediaType, parameters } = result.data
    
    let job
    if (mediaType === 'image') {
      job = await generateImage({ prompt, modelId, parameters })
    } else {
      job = await generateVideo({ prompt, modelId, parameters })
    }
    
    return { success: true, jobId: job.jobId, status: job.status }
  } catch (error: any) {
    console.error('Generation Error:', error)
    return { error: 'Generation could not be completed. The AI provider returned an error. Please try again.' }
  }
}

