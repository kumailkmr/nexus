export interface GenerationResult {
  jobId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  outputs?: {
    url: string;
    mime_type: string;
    width?: number;
    height?: number;
  }[];
  error?: string;
}

export interface ImageProvider {
  generateImage(prompt: string, parameters: any): Promise<GenerationResult>;
}

export interface VideoProvider {
  generateVideo(prompt: string, parameters: any): Promise<GenerationResult>;
}

export class ProviderRegistry {
  private imageProviders = new Map<string, ImageProvider>();
  private videoProviders = new Map<string, VideoProvider>();

  registerImageProvider(slug: string, provider: ImageProvider) {
    this.imageProviders.set(slug, provider);
  }

  registerVideoProvider(slug: string, provider: VideoProvider) {
    this.videoProviders.set(slug, provider);
  }

  getImageProvider(slug: string): ImageProvider {
    const provider = this.imageProviders.get(slug);
    if (!provider) throw new Error(`Image provider ${slug} not configured`);
    return provider;
  }

  getVideoProvider(slug: string): VideoProvider {
    const provider = this.videoProviders.get(slug);
    if (!provider) throw new Error(`Video provider ${slug} not configured`);
    return provider;
  }
}

export const registry = new ProviderRegistry();
