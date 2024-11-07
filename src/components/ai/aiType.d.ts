export interface AiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  messageId: string
}

export interface ChatBlock {
  chatList: AiMessage[]
  chatId: string
  chatTitle: string
  lastChatTime: string
}
