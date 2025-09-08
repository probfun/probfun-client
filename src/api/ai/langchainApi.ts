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

// import { error as toastError } from '@/utils/toast';

// export interface LangchainChatRequest {
//   messages: Array<{
//     id: string;
//     content: string;
//   }>;
//   conversationId?: string;
// }

// export interface LangchainChatResponse {
//   message: string;
//   conversation_id: string;
// }

// /* ---------- 工具函数 ---------- */
// function getAuthToken(): string {
//   const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3NDE5NjA5LCJpYXQiOjE3NTcxNjA0MDksImp0aSI6ImQ1ZWE5YjRjZWY2NjRlMDhhNjFhMGEwNWFhYTZkZDk2IiwidXNlcl9pZCI6IjgzIn0.N5ZzGGdzk_qHNqgskx84GrwgvRjAfC2cexRm0gBSElE';
//   console.log(token);
//   return `Bearer ${token}`;
// }

// /* ---------- 公共流式调用 ---------- */
// /* ---------- 公共流式调用 ---------- */
// async function streamChat(
//   message: string,
//   conversationId?: string,
//   abortCtrl?: AbortController,
//   onChunk?: (chunk: string) => void,
// ): Promise<LangchainChatResponse> {
//   let fullMessage = '';
//   let cid = conversationId || '';

//   // 构造请求体
//   const body = JSON.stringify({
//     messages: cid
//       ? [{ id: cid, content: message }]
//       : [{ content: message }],
//   });

//   // 发起 fetch（不设置 Accept:text/event-stream）
//   const res = await fetch('/langchain/chat/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': getAuthToken(),
//     },
//     body,
//     signal: abortCtrl?.signal,
//   });

//   if (!res.ok) {
//     throw new Error(`HTTP error! status: ${res.status}`);
//   }

//   if (!res.body) {
//     throw new Error('ReadableStream not supported');
//   }

//   // 获取 UTF-8 解码器
//   const reader = res.body.getReader();
//   const decoder = new TextDecoder('utf-8');

//   let buffer = '';

//   // 逐块读取流
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done)
//       break;

//     // 将二进制块转为字符串
//     buffer += decoder.decode(value, { stream: true });

//     // 按行分割
//     const lines = buffer.split('\n');
//     buffer = lines.pop() || ''; // 最后一行可能不完整，留到下一轮

//     for (const line of lines) {
//       const trimmed = line.trim();
//       if (trimmed === '')
//         continue;

//       // SSE 规范：以 "data: " 开头
//       if (trimmed.startsWith('data: ')) {
//         const payload = trimmed.slice(6);
//         if (payload === '[DONE]')
//           continue; // 可选结束标记

//         try {
//           const data = JSON.parse(payload);

//           // 解析两种业务事件
//           if (data.type === 'conversation_info') {
//             cid = data.content;
//           }
//           else if (data.type === 'text' && typeof data.content === 'string') {
//             fullMessage += data.content;
//             onChunk?.(data.content);
//           }
//         }
//         catch {
//           // 非 JSON 行忽略
//         }
//       }
//     }
//   }

//   // 流结束，返回完整结果
//   return { message: fullMessage, conversation_id: cid };
// }

// /* ---------- 对外 API（保持原签名） ---------- */
// export async function langchainChatApi(
//   messages: string,
//   conversationId?: string,
//   onMessage?: (chunk: string) => void,
//   onComplete?: (full: string, cid: string) => void,
//   onError?: (err: string) => void,
//   abortController?: AbortController,
// ): Promise<void> {
//   try {
//     let full = '';
//     const { conversation_id: cid } = await streamChat(
//       messages,
//       conversationId,
//       abortController,
//       (chunk) => {
//         full += chunk;
//         onMessage?.(chunk);
//       },
//     );
//     onComplete?.(full, cid);
//   }
//   catch (err: any) {
//     const msg = err.message || '网络错误';
//     onError ? onError(msg) : toastError(`AI服务故障: ${msg}`);
//   }
// }
