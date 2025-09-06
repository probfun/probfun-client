import { fetchEventSource } from '@microsoft/fetch-event-source';
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

/* ---------- 工具函数 ---------- */
function getAuthToken(): string {
  const token = localStorage.getItem('token') || '';
  return `Bearer ${token}`;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ---------- 公共流式调用 ---------- */
async function streamChat(
  message: string,
  conversationId?: string,
  abortCtrl?: AbortController,
  onChunk?: (chunk: string) => void,
): Promise<LangchainChatResponse> {
  let fullMessage = '';
  let cid = '';

  await fetchEventSource('/langchain/chat/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthToken(),
    },
    body: JSON.stringify({
      messages: [{ id: generateUUID(), content: message }],
      ...(conversationId && { conversationId }),
    }),
    signal: abortCtrl?.signal,
    async onopen(res) {
      if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);
    },
    onmessage(ev) {
      const data = JSON.parse(ev.data);
      if (data.message) {
        fullMessage += data.message;
        onChunk?.(data.message);
      }
      if (data.conversation_id)
        cid = data.conversation_id;
    },
  });

  return { message: fullMessage, conversation_id: cid };
}

/* ---------- 对外 API ---------- */
// export async function langchainChatApi(
//   message: string,
//   conversationId?: string,
//   onSuccess?: (res: LangchainChatResponse) => void,
//   onError?: (err: string) => void,
// ): Promise<LangchainChatResponse | null> {
//   try {
//     const res = await streamChat(message, conversationId);
//     onSuccess?.(res);
//     return res;
//   } catch (err: any) {
//     const msg = err.message || '网络错误';
//     onError ? onError(msg) : toastError(`AI服务故障: ${msg}`);
//     return null;
//   }
// }

export async function langchainChatApi(
  message: string,
  conversationId?: string,
  onMessage?: (chunk: string) => void,
  onComplete?: (full: string, cid: string) => void,
  onError?: (err: string) => void,
  abortController?: AbortController,
): Promise<void> {
  try {
    let full = '';
    await streamChat(
      message,
      conversationId,
      abortController,
      (chunk) => {
        full += chunk;
        onMessage?.(chunk);
      },
    );
    onComplete?.(full, '');
  }
  catch (err: any) {
    const msg = err.message || '网络错误';
    onError ? onError(msg) : toastError(`AI服务故障: ${msg}`);
  }
}
