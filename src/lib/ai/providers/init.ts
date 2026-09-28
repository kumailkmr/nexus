import { registry } from './provider-registry'
import { OpenAIImageProvider } from './openai/image-provider'
import { HiggsfieldVideoProvider } from './higgsfield/video-provider'

// Register providers to the registry
registry.registerImageProvider('openai', new OpenAIImageProvider())
registry.registerVideoProvider('higgsfield', new HiggsfieldVideoProvider())

export { registry }
