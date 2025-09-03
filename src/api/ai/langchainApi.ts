import { error as toastError } from '@/utils/toast';

export interface LangchainChatRequest {
  messages: Array<{
    id: string;
    content: string;
  }>;
  conversationId?: string;
}

export interface LangchainChatResponse {
  message: string;
  conversation_id: string;
}

// 获取token的函数
function getAuthToken(): string {
  // 从localStorage或其他存储中获取token
  const token = localStorage.getItem('token') || '';
  return `Bearer ${token}`;
}

// 生成唯一ID的函数
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 调用/langchain/chat/接口
export async function langchainChatApi(
  message: string,
  conversationId?: string,
  onSuccess?: (response: LangchainChatResponse) => void,
  onError?: (error: string) => void,
): Promise<LangchainChatResponse | null> {
  try {
    const requestBody: LangchainChatRequest = {
      messages: [{
        id: generateUUID(),
        content: message,
      }],
    };

    // 如果不是第一次对话，带上conversationId
    if (conversationId) {
      requestBody.conversationId = conversationId;
    }

    const response = await fetch('/langchain/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken(),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LangchainChatResponse = await response.json();

    if (onSuccess) {
      onSuccess(data);
    }

    return data;
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : '网络错误';

    if (onError) {
      onError(errorMessage);
    }
    else {
      toastError(`AI服务故障: ${errorMessage}`);
    }

    return null;
  }
}

// 流式调用/langchain/chat/接口（如果需要流式响应）
export async function langchainChatStreamApi(
  message: string,
  conversationId?: string,
  onMessage?: (chunk: string) => void,
  onComplete?: (fullResponse: string, newConversationId: string) => void,
  onError?: (error: string) => void,
  abortController?: AbortController,
): Promise<void> {
  try {
    const requestBody: LangchainChatRequest = {
      messages: [{
        id: generateUUID(),
        content: message,
      }],
    };

    if (conversationId) {
      requestBody.conversationId = conversationId;
    }

    const response = await fetch('/langchain/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken(),
      },
      body: JSON.stringify(requestBody),
      signal: abortController?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 检查是否是流式响应
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/stream')) {
      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader)
        throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let fullResponse = '';
      let newConversationId = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.message) {
                  fullResponse += data.message;
                  if (onMessage)
                    onMessage(data.message);
                }
                if (data.conversation_id) {
                  newConversationId = data.conversation_id;
                }
              }
              catch {
                // 忽略解析错误
              }
            }
          }
        }

        if (onComplete)
          onComplete(fullResponse, newConversationId);
      }
      finally {
        reader.releaseLock();
      }
    }
    else {
      // 处理普通响应
      const data: LangchainChatResponse = await response.json();
      if (onMessage)
        onMessage(data.message);
      if (onComplete)
        onComplete(data.message, data.conversation_id);
    }
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : '网络错误';

    if (onError) {
      onError(errorMessage);
    }
    else {
      toastError(`AI服务故障: ${errorMessage}`);
    }
  }
}
