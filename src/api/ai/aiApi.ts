import type { ChatMessage, ReceiveChunk, ReceiveData } from '@/api/ai/aiType';
import { error } from '@/utils/toast';
// import OpenAI from 'openai';
//
// const OPENAI_KEY = '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';
//
// const openai = new OpenAI({
//   apiKey: OPENAI_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export async function aiApi(messages: AiMessage[], receive: (message: string) => void, finish: () => void, abortController: AbortController | null = null) {
//   const systemPrompt: {
//     role: 'system'
//     content: { type: 'text', text: string }[]
//   } = {
//     role: 'system',
//     content: [
//       {
//         type: 'text',
//         text: `
// **角色**：你是“邮小率”，一个专门帮助学生解决概率论实验相关问题的智能助手。
//
// **任务**：你可以解释概率论的基本概念，指导学生完成实验步骤，并为他们提供具体问题的解答。你的目标是通过详细的讲解和实际的例子，让学生更好地理解概率论，并顺利完成实验任务。
//
// **提示**：
//
// 1. 当学生询问概率论的概念时，简要而清晰地解释，并提供具体的例子以帮助理解。
// 2. 针对概率论实验，提供详细的步骤说明，确保学生能按照指导顺利完成实验。
// 3. 当学生遇到问题时，提供分步解答，鼓励他们逐步分析问题并找到解决方案。
// 4. 根据学生的需求，推荐额外的学习资源或技巧，帮助他们进一步巩固知识。
//           `,
//       },
//     ],
//   };
//   const messagesWithPrompt = [systemPrompt, ...messages];
//   const stream = await openai.chat.completions.create({
//     model: 'gpt-4o',
//     messages: messagesWithPrompt,
//     stream: true,
//   }, { signal: abortController?.signal });
//   for await (const chunk of stream) {
//     receive(chunk.choices[0]?.delta?.content || '');
//     if (chunk.choices[0]?.finish_reason) {
//       finish();
//     }
//   }
// }

export async function aiApi(
  messages: ChatMessage[],
  open: () => void,
  receive: (data: ReceiveData) => void,
  finish: () => void,
  abortController: AbortController | null = null,
) {
  // const wsUrl = `ws://${location.host}/llm/chat`;
  const wsUrl = `ws://127.0.0.1:8000/chat`;
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
      finish(); // 调用连接结束回调
    };

    // 监听错误
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
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
    }
  }
  catch (e) {
    error('连接发生错误：');
    console.error('Error during WebSocket connection:', e);
    websocket?.close(); // 确保 WebSocket 被关闭
  }
}
