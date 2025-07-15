import type { Chat, ChatBlock, ChatMessage, Tool } from '@/api/ai/aiType';
import { v4 as uuidv4 } from 'uuid';
import { useAiStore } from '@/store';
import { error, success } from '@/utils/toast';

export const DEFAULT_CHAT_TITLE = '概率论实验';

export const START_BLOCK: ChatBlock = {
  role: 'ai',
  data: [
    {
      type: 'text',
      text: '我是“邮小率”，你的智能助手，专门帮助学生解决概率论实验相关的问题。如果你有关于概率论的概念、实验步骤或者具体问题需要解答，随时告诉我，我会尽力帮助你！',
    },
  ],
  blockId: uuidv4(),
};

export function createChat() {
  const chat: Chat = {
    chatBlocks: [
      START_BLOCK,
    ],
    chatId: uuidv4(),
    chatTitle: DEFAULT_CHAT_TITLE,
    lastChatTime: new Date().toLocaleString(),
  };
  return chat;
}

export function getChatMessages() {
  const aiStore = useAiStore();
  if (!aiStore.currentChat) {
    return [];
  }
  const chatMessages: ChatMessage[] = [];
  const chatBlocks = aiStore.currentChat?.chatBlocks;
  for (const block of chatBlocks) {
    for (const data of block.data) {
      if (data.type === 'text') {
        chatMessages.push({
          role: block.role === 'ai' ? 'assistant' : 'user',
          content: data.text as string,
        });
      }
      else if (data.type === 'tool') {
        const args = JSON.stringify((data.tool as Tool).args);
        chatMessages.push({
          role: 'function',
          name: (data.tool as Tool).name,
          content: args,
        });
      }
    }
  }
  return chatMessages;
}

export function createUserBlock(userMessage: string) {
  const aiStore = useAiStore();
  if (!aiStore.currentChat) {
    aiStore.currentChat = createChat();
    aiStore.chatList.push(aiStore.currentChat);
  }
  const chat = aiStore.currentChat;
  const newUserBlock: ChatBlock = {
    role: 'user',
    data: [
      {
        type: 'text',
        text: userMessage,
      },
    ],
    blockId: uuidv4(),
  };
  chat.chatBlocks.push(newUserBlock);
  chat.lastChatTime = new Date().toLocaleString();
}

export function deleteMessage(block: ChatBlock) {
  const aiStore = useAiStore();
  const currentChat = aiStore.currentChat;
  if (!currentChat) {
    return;
  }
  currentChat.chatBlocks = currentChat.chatBlocks.filter(m => m !== block);
}

export function copyMessage(block: ChatBlock) {
  try {
    let message = '';
    for (const data of block.data) {
      if (data.type === 'text') {
        message += `${data.text}\n`;
      }
    }
    navigator.clipboard.writeText(message);
    success('复制成功');
  }
  catch (e: any) {
    console.error('Error:', e);
    error('复制失败');
  }
}
