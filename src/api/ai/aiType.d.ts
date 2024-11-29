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
  std: number
}

export interface BuffonNeedleArgs {
  needleLength: number
  floorLineSpacing: number
  needleAmount: number
}

export interface ToolArgs extends NormalDistributionArgs, BuffonNeedleArgs {}

export interface Tool {
  name: string
  args: ToolArgs
}

export interface ReceiveData {
  message: string
  tool: {
    name: string
    args: string
  }
}

export interface ReceiveChunk {
  data: ReceiveData
  done: boolean
}
