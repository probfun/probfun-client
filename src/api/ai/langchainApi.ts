import type { EventSourceMessage } from '@microsoft/fetch-event-source';
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
  console.log(token);
  return `Bearer ${token}`;
}

/* ---------- 公共流式调用 ---------- */
/* ---------- 公共流式调用 ---------- */
async function streamChat(
  message: string,
  conversationId?: string,
  abortCtrl?: AbortController,
  onChunk?: (chunk: string) => void,
): Promise<LangchainChatResponse> {
  let fullMessage = '';
  let cid = conversationId || '';

  // ===== 打印即将发出的请求 =====
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': getAuthToken(),
    'Accept': '*/*',
  };
  const body = JSON.stringify({
    messages: [{ content: message }],
    ...(cid && { conversationId: cid }),
  });
  console.log('【Request Headers】', headers);
  console.log('【Request Body】', body);
  // ==============================

  await fetchEventSource('/backend-api/langchain/chat/', {
    method: 'POST',
    headers,
    body,
    signal: abortCtrl?.signal,
    async onopen(res: Response) {
      if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);
    },
    onmessage(ev: EventSourceMessage) {
      const data = JSON.parse(ev.data);
      if (data.type === 'conversation_info') {
        cid = data.content;
      }
      if (data.type === 'text' && typeof data.content === 'string') {
        fullMessage += data.content;
        onChunk?.(data.content);
      }
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
  messages: string,
  conversationId?: string,
  onMessage?: (chunk: string) => void,
  onComplete?: (full: string, cid: string) => void,
  onError?: (err: string) => void,
  abortController?: AbortController,
): Promise<void> {
  try {
    let full = '';
    const { conversation_id: cid } = await streamChat(
      messages,
      conversationId,
      abortController,
      (chunk) => {
        full += chunk;
        onMessage?.(chunk);
      },
    );
    onComplete?.(full, cid);
  }
  catch (err: any) {
    const msg = err.message || '网络错误';
    onError ? onError(msg) : toastError(`AI服务故障: ${msg}`);
  }
}
