'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Video, Sparkles, Loader2, Download, Copy, RefreshCw } from 'lucide-react'
import { calculateGenerationCost, generateAsset } from '@/app/app/studio/actions'

type MediaType = 'image' | 'video'

interface StudioWorkspaceProps {
  models: any[]
}

export function StudioWorkspace({ models }: StudioWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<MediaType>('image')
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('IDLE')
  const [result, setResult] = useState<any>(null)
  
  const [costEstimate, setCostEstimate] = useState<string>('COST ESTIMATE UNAVAILABLE')
  const [isCalculatingCost, setIsCalculatingCost] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  
  // Settings
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [quality, setQuality] = useState('standard')
  const [duration, setDuration] = useState(5)
  const [orientation, setOrientation] = useState('landscape')

  const availableModels = models.filter(m => m.media_type === activeTab)
  
  // Initialize default model if not set
  useEffect(() => {
    if (availableModels.length > 0 && !availableModels.find(m => m.id === selectedModel)) {
      setSelectedModel(availableModels[0].id)
    }
  }, [activeTab, availableModels, selectedModel])

  useEffect(() => {
    if (!selectedModel) {
      setCostEstimate('COST ESTIMATE UNAVAILABLE')
      return
    }

    const fetchCost = async () => {
      setIsCalculatingCost(true)
      const res = await calculateGenerationCost({
        modelId: selectedModel,
        mediaType: activeTab,
        duration: activeTab === 'video' ? duration : undefined,
        orientation: activeTab === 'video' ? orientation : undefined,
        quality: activeTab === 'image' ? quality : undefined
      })
      
      if (res.error) {
        setCostEstimate('COST ESTIMATE UNAVAILABLE')
      } else if (res.cost !== undefined) {
        setCostEstimate(res.cost === 0 ? 'FREE' : `${res.currency === 'USD' ? '$' : '₹'}${res.cost.toFixed(4)}`)
      }
      setIsCalculatingCost(false)
    }

    fetchCost()
  }, [selectedModel, activeTab, duration, orientation, quality])

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedModel) return
    setStatus('SUBMITTING')
    setGenerationError(null)
    
    const params = activeTab === 'image' 
      ? { aspectRatio, quality }
      : { duration, orientation }

    const res = await generateAsset({
      prompt: prompt.trim(),
      modelId: selectedModel,
      mediaType: activeTab,
      parameters: params
    })

    if (res.error) {
      setStatus('FAILED')
      setGenerationError(res.error)
      return
    }
    
    setStatus(res.status as any)

    // Simulate async processing (in reality we would poll or wait for webhook)
    setTimeout(() => setStatus('PROCESSING'), 2500)
    setTimeout(() => {
      setStatus('COMPLETED')
      setResult({
        url: activeTab === 'image' 
          ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
          : null,
        type: activeTab,
        prompt
      })
    }, 5500)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)]">
      
      {/* Controls Sidebar */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 lg:overflow-y-auto lg:pr-2 pb-4">
        
        {/* Mode Selector */}
        <div className="flex p-1 bg-nexus-secondary rounded-lg border border-nexus-border">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'image' 
                ? 'bg-white text-nexus-blue shadow-sm border border-nexus-border' 
                : 'text-nexus-secondary-text hover:text-nexus-primary'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> IMAGE
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'video' 
                ? 'bg-white text-nexus-blue shadow-sm border border-nexus-border' 
                : 'text-nexus-secondary-text hover:text-nexus-primary'
            }`}
          >
            <Video className="w-4 h-4" /> VIDEO
          </button>
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-nexus-primary uppercase tracking-wider">Prompt</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the creative asset you want to generate..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-nexus-border bg-white text-sm text-nexus-primary focus:outline-none focus:ring-2 focus:ring-nexus-blue resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-nexus-muted">
              {prompt.length} / 1000
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-5 bg-white border border-nexus-border rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-nexus-primary uppercase tracking-wider">Generation Settings</h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-nexus-secondary-text font-medium">Model</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-nexus-border bg-nexus-secondary text-sm focus:outline-none focus:ring-2 focus:ring-nexus-blue"
            >
              {availableModels.map(m => (
                <option key={m.id} value={m.id}>{m.provider.name} - {m.name}</option>
              ))}
            </select>
          </div>

          {activeTab === 'image' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-nexus-secondary-text font-medium">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1:1', '16:9', '9:16'].map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-3 py-2 rounded border text-xs font-medium transition-colors ${
                        aspectRatio === ratio ? 'bg-nexus-surface border-nexus-blue text-nexus-blue' : 'bg-white border-nexus-border text-nexus-secondary-text hover:bg-nexus-secondary'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs text-nexus-secondary-text font-medium">Quality</label>
                <div className="grid grid-cols-2 gap-2">
                  {['standard', 'hd'].map(q => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`px-3 py-2 rounded border text-xs font-medium uppercase transition-colors ${
                        quality === q ? 'bg-nexus-surface border-nexus-blue text-nexus-blue' : 'bg-white border-nexus-border text-nexus-secondary-text hover:bg-nexus-secondary'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'video' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-nexus-secondary-text font-medium">Orientation</label>
                <div className="grid grid-cols-2 gap-2">
                  {['landscape', 'portrait'].map(o => (
                    <button
                      key={o}
                      onClick={() => setOrientation(o)}
                      className={`px-3 py-2 rounded border text-xs font-medium capitalize transition-colors ${
                        orientation === o ? 'bg-nexus-surface border-nexus-blue text-nexus-blue' : 'bg-white border-nexus-border text-nexus-secondary-text hover:bg-nexus-secondary'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-nexus-secondary-text font-medium">Duration (sec)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-3 py-2 rounded border text-xs font-medium transition-colors ${
                        duration === d ? 'bg-nexus-surface border-nexus-blue text-nexus-blue' : 'bg-white border-nexus-border text-nexus-secondary-text hover:bg-nexus-secondary'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cost Preview */}
        <div className="bg-nexus-secondary border border-nexus-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-nexus-muted uppercase tracking-widest">Estimated Cost</span>
            <span className="text-sm font-semibold text-nexus-primary">
              {isCalculatingCost ? 'Calculating...' : costEstimate}
            </span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={status !== 'IDLE' && status !== 'COMPLETED' && status !== 'FAILED'}
          className="w-full flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(21,94,239,0.2)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {status === 'IDLE' || status === 'COMPLETED' || status === 'FAILED' ? (
            <>
              <Sparkles className="w-4 h-4" /> GENERATE {activeTab}
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {status}
            </>
          )}
        </button>

      </div>

      {/* Canvas / Result Area */}
      <div className="flex-1 bg-nexus-secondary rounded-2xl border border-nexus-border border-dashed flex flex-col overflow-hidden min-h-[400px]">
        {status === 'IDLE' && !result ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-nexus-border flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-nexus-muted" />
            </div>
            <h2 className="text-lg font-bold text-nexus-primary mb-2">Creative Canvas</h2>
            <p className="text-sm text-nexus-secondary-text max-w-md">
              Configure your settings and enter a prompt to generate your next creative asset.
            </p>
          </div>
        ) : status === 'COMPLETED' && result ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8 flex items-center justify-center bg-nexus-surface">
              {result.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Generated result" className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg border border-nexus-border" />
              ) : (
                <div className="w-full max-w-2xl aspect-video bg-black rounded-xl flex items-center justify-center text-white/50 text-sm border border-nexus-border">
                  Video Player Placeholder
                </div>
              )}
            </div>
            <div className="bg-white border-t border-nexus-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-nexus-primary truncate">{result.prompt}</p>
                <p className="text-xs text-nexus-secondary-text mt-1 capitalize">{activeTab} • DALL-E 3</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-4 py-2 bg-nexus-secondary hover:bg-nexus-surface border border-nexus-border rounded-lg text-sm font-semibold text-nexus-primary transition-colors">
                  SAVE TO ASSETS
                </button>
                <button className="p-2 bg-nexus-secondary hover:bg-nexus-surface border border-nexus-border rounded-lg text-nexus-secondary-text transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : status === 'FAILED' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center mb-6 text-red-500">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-nexus-primary mb-2">Generation Failed</h2>
            <p className="text-sm text-red-600 max-w-sm mb-6">{generationError || 'An unexpected error occurred.'}</p>
            <button 
              onClick={() => { setStatus('IDLE'); setGenerationError(null) }}
              className="px-4 py-2 bg-white text-nexus-primary text-sm font-medium rounded-lg border border-nexus-border hover:bg-nexus-secondary transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 relative mb-6">
              <div className="absolute inset-0 border-4 border-nexus-border rounded-full"></div>
              <div className="absolute inset-0 border-4 border-nexus-blue rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-nexus-blue">
                {status === 'SUBMITTING' ? '10%' : status === 'QUEUED' ? '30%' : '75%'}
              </div>
            </div>
            <h2 className="text-base font-bold text-nexus-primary mb-1">{status}</h2>
            <p className="text-sm text-nexus-secondary-text">Your request is being processed by the AI provider.</p>
          </div>
        )}
      </div>
      
    </div>
  )
}
