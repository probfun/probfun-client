import type { ChatMessage, ReceiveChunk, ReceiveData } from '@/api/ai/aiType';
import { error } from '@/utils/toast';
import { postRaw } from '../request';

export async function aiApi(
  messages: ChatMessage[],
  open: () => void,
  receive: (data: ReceiveData) => void,
  finish: () => void,
  abortController: AbortController | null = null,
) {
  const head = window.location.protocol === 'https:' ? 'wss' : 'ws';
  console.log('WebSocket URL:', head);
  const wsUrl = `${head}://${location.host}/backend-api/ai/chat`;
  let websocket: WebSocket | null = null;

  try {
    websocket = new WebSocket(wsUrl);

    // WebSocket连接成功
    websocket.onopen = () => {
      console.log('WebSocket connection established');
      open();
      console.log(messages);
      websocket?.send(JSON.stringify({ messages }));
    };

    // 监听连接关闭
    websocket.onclose = () => {
      console.log('WebSocket connection closed');
      // finish(); // 调用连接结束回调
    };

    // 监听错误
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      finish();
    };

    // 如果提供了 AbortController，监听中断信号
    if (abortController) {
      abortController.signal.addEventListener('abort', () => {
        console.log('Connection aborted by AbortController');
        websocket?.close(); // 关闭 WebSocket 连接
      });
    }

    // 接收服务端消息
    websocket.onmessage = (event) => {
      const { data, done } = JSON.parse(event.data) as ReceiveChunk;
      if (done) {
        finish();
        websocket?.close();
      }
      receive(data);
    };
  }
  catch (e) {
    error('连接发生错误：');
    console.error('Error during WebSocket connection:', e);
    websocket?.close(); // 确保 WebSocket 被关闭
  }
}

export async function generateTitleApi(messages: ChatMessage[]) {
  return await postRaw<{
    title: string;
  }>('/ai/title', { messages });
}

export async function generateDistributionFunctionApi(distribution: string) {
  return await postRaw<{
    function: string;
    latex: string;
    min: number;
    max: number;
  }>('/ai/distribution_function', { distribution }, {
    timeout: 20000,
  });
}
