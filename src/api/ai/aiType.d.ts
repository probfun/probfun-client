export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'function'
  content: string
  name?: string
}

export interface ChatData {
  type: 'text' | 'tool'
  text?: string
  tool?: Tool
}

export interface ChatBlock {
  role: 'user' | 'ai'
  data: ChatData[]
  blockId: string
}

export interface Chat {
  chatBlocks: ChatBlock[]
  chatId: string
  chatTitle: string
  lastChatTime: string
}

export interface NormalDistributionArgs {
  mean: number
  stdDev: number
}

export interface GeometricDistributionArgs {
  p: number
  n: number
}

export interface BinomialDistributionArgs {
  n: number
  p: number
}

export interface ExponentialDistributionArgs {
  rate: number
}

export interface UniformDistributionArgs {
  a: number
  b: number
}

export interface PoissonDistributionArgs {
  lambda: number
}

export interface DistributionArgs {
  type: 'normal' | 'uniform' | 'geometric' | 'poisson' | 'binomial' | 'exponential'
  args: NormalDistributionArgs | GeometricDistributionArgs | BinomialDistributionArgs | ExponentialDistributionArgs | UniformDistributionArgs | PoissonDistributionArgs
}

export interface BuffonNeedleArgs {
  needleLength: number
  floorLineSpacing: number
  needleAmount: number
}

export interface ToolArgs extends DistributionArgs, BuffonNeedleArgs {}

export interface Tool {
  name: string
  args: ToolArgs
}

export type ReceiveData = {
  message?: string
  tool?: {
    name: string
    args: string
  }
} | null

export interface ReceiveChunk {
  data: ReceiveData
  done: boolean
}
